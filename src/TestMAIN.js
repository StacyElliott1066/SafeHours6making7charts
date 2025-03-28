import React, { useState } from "react";
import Charts from "./Charts"; // Make sure this is the correct path

const App = () => {
  // ✅ Create sample schedule data
  const [timelineData, setTimelineData] = useState([
    {
      date: "2025-03-26",
      start: "08:00",
      end: "10:00",
      activity: "Flight",
    },
    {
      date: "2025-03-27",
      start: "12:00",
      end: "14:00",
      activity: "Ground",
    },
  ]);

  // ✅ Default selected date
  const [selectedDate, setSelectedDate] = useState("2025-03-26");

  // ✅ Debugging: Log timelineData before rendering
  console.log("App.js - timelineData:", timelineData);

  return (
    <div>
      <h1>Schedule Timeline</h1>
      {/* ✅ Pass the timelineData to Charts */}
      <Charts timelineData={timelineData} targetDate={selectedDate} />
    </div>
  );
};

export default App;
