const express = require("express");

const axios = require("axios");

const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 5000;


const BASE_URL =
  "http://20.207.122.201/evaluation-service";


const authData = {
  email: "neerajvs99@gmail.com",
  name: "neeraj v s",
  rollNo: "kh.en.p2mca25141",
  accessCode: "PTBMmQ",

  clientID:
    "be1e71d5-b96e-4c04-8893-cb89780b06e8",

  clientSecret:
    "VUFrmVnBnBFvQbCn",
};


app.get(
  "/notifications",
  async (req, res) => {
    try {
     
      const authResponse =
        await axios.post(
          `${BASE_URL}/auth`,
          authData
        );

      const token =
        authResponse.data.access_token;

      
      const response =
        await axios.get(
          `${BASE_URL}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      res.json(
        response.data.notifications
      );
    } catch (error) {
      console.log(error.message);

      res
        .status(500)
        .json({
          error:
            "Failed to fetch notifications",
        });
    }
  }
);


app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});