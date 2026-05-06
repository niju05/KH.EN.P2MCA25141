import React, { useState } from "react";
import NotificationPage from "./notification_app_fe/notification_page(stage2)";

function App() {
  const [page, setPage] = useState("notifications");

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("notifications")} style={{ marginRight: 10 }}>
          Notifications
        </button>

      </div>

     
        <NotificationPage />
      
    </div>
  );
}

export default App;