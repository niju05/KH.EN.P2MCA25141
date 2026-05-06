import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Chip,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";


const PRIORITY_WEIGHT = {
  placement: 3,
  result: 2,
  event: 1,
};


const CATEGORY_COLOR = {
  placement: "success",
  result: "warning",
  event: "info",
};

const NotificationPage = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [topN, setTopN] =
    useState(10);

  const [filter, setFilter] =
    useState("all");

  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        setLoading(true);
        setError("");

      
        const response =
          await axios.get(
            "http://localhost:5000/notifications"
          );

        const apiNotifications =
          response.data;

        
        const formatted =
          apiNotifications.map(
            (item) => ({
              id: item.ID,

              type:
                item.Type.toLowerCase(),

              message:
                item.Message,

              timestamp:
                item.Timestamp,

              read: false,
            })
          );

        setNotifications(formatted);
      } catch (err) {
        console.log(err);

        setError(
          "Failed to fetch notifications"
        );
      } finally {
        setLoading(false);
      }
    };

  const filteredNotifications =
    useMemo(() => {
      if (filter === "all") {
        return notifications;
      }

      return notifications.filter(
        (item) => item.type === filter
      );
    }, [notifications, filter]);

  
  const sortedNotifications =
    useMemo(() => {
      return [
        ...filteredNotifications,
      ].sort((a, b) => {
        const priorityDiff =
          PRIORITY_WEIGHT[b.type] -
          PRIORITY_WEIGHT[a.type];

        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        return (
          new Date(b.timestamp) -
          new Date(a.timestamp)
        );
      });
    }, [filteredNotifications]);


  const topNotifications =
    useMemo(() => {
      return sortedNotifications.slice(
        0,
        topN
      );
    }, [sortedNotifications, topN]);

  
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4 }}
    >
      {/* ================= TITLE ================= */}
      <Typography
        variant="h4"
        gutterBottom
      >
        Priority Inbox
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        mb={3}
      >
        Notifications prioritized using:
        Placement &gt; Result &gt;
        Event + Recency
      </Typography>

      {/* ================= FILTERS ================= */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        {/* ================= TABS ================= */}
        <Tabs
          value={filter}
          onChange={(e, value) =>
            setFilter(value)
          }
        >
          <Tab
            label={
              <Badge
                badgeContent={
                  notifications.length
                }
                color="primary"
              >
                All
              </Badge>
            }
            value="all"
          />

          <Tab
            label="Placement"
            value="placement"
          />

          <Tab
            label="Result"
            value="result"
          />

          <Tab
            label="Event"
            value="event"
          />
        </Tabs>

        {/* ================= TOP N ================= */}
        <Select
          value={topN}
          onChange={(e) =>
            setTopN(e.target.value)
          }
          size="small"
        >
          <MenuItem value={10}>
            Top 10
          </MenuItem>

          <MenuItem value={15}>
            Top 15
          </MenuItem>

          <MenuItem value={20}>
            Top 20
          </MenuItem>
        </Select>
      </Box>

      {/* ================= LOADING ================= */}
      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* ================= ERROR ================= */}
          {error && (
            <Typography
              color="error"
              mb={2}
            >
              {error}
            </Typography>
          )}

          {/* ================= NOTIFICATIONS ================= */}
          <Grid container spacing={3}>
            {topNotifications.map(
              (notification) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={notification.id}
                >
                  <Card
                    elevation={
                      notification.read
                        ? 1
                        : 5
                    }
                    onClick={() =>
                      markAsRead(
                        notification.id
                      )
                    }
                    sx={{
                      cursor: "pointer",

                      border:
                        notification.read
                          ? "1px solid #ddd"
                          : "2px solid #1976d2",

                      backgroundColor:
                        notification.read
                          ? "#f5f5f5"
                          : "#ffffff",

                      transition:
                        "0.3s",

                      height: "100%",
                    }}
                  >
                    <CardContent>
                      {/* ================= TYPE ================= */}
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Chip
                          label={notification.type.toUpperCase()}
                          color={
                            CATEGORY_COLOR[
                              notification
                                .type
                            ]
                          }
                        />

                        {!notification.read && (
                          <Chip
                            label="NEW"
                            color="error"
                            size="small"
                          />
                        )}
                      </Box>

                      {/* ================= MESSAGE ================= */}
                      <Typography
                        variant="h6"
                        gutterBottom
                      >
                        {
                          notification.message
                        }
                      </Typography>

                      {/* ================= TIME ================= */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {new Date(
                          notification.timestamp
                        ).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default NotificationPage;