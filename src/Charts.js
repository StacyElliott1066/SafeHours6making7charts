import React, { useState } from "react";

const COLORS = {
  Flight: "blue",
  Ground: "brown",
  "SIM/ATD": "purple",
  "Other Sched. Act.": "gray",
  "Other Sched.": "gray",
};

const timeToNumeric = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const formatLocalDate = (dateObj) => {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(dateObj.getDate()).padStart(2, "0")}`;
};

const formatDateLabel = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const day = String(date.getDate()).padStart(2, "0");
  const monthShort = date.toLocaleString("en-US", { month: "short" });
  return `${day}-${monthShort}`;
};

const Charts = ({ timelineData, targetDate }) => {
  const [showFuture, setShowFuture] = useState(false);

  let baseDate = new Date(targetDate);
  if (!targetDate || isNaN(baseDate.getTime())) {
    console.warn("Invalid or missing targetDate. Using today.");
    baseDate = new Date();
  }
  baseDate.setHours(0, 0, 0, 0);

  const getDateString = (offset) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);
    return formatLocalDate(d);
  };

  const days = Array.from({ length: 7 }, (_, i) =>
    getDateString(showFuture ? i : -6 + i)
  );

  // ✅ FIXED: Manual local parsing to avoid UTC shift
  const getDayActivities = (day) => {
    console.log("Checking activities for:", day);
    console.log("Timeline data:", timelineData);

    return timelineData.filter((item) => item.date === day);
  };

  const renderTimeline = (activities, label) => (
    <div
      key={label}
      style={{
        marginTop: "5px",
        width: "100%",
        padding: "0 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "50px",
          backgroundColor: "#f5f5f5",
          border: "1px solid black",
        }}
      >
        {/* Horizontal line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "black",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {[...Array(13)].map((_, i) => {
            const hour = i * 2;
            const percent = (i / 12) * 100;
            return (
              <React.Fragment key={hour}>
                <div
                  style={{
                    position: "absolute",
                    left: `${percent}%`,
                    top: "50%",
                    width: "1px",
                    height: "8px",
                    backgroundColor: "black",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: `${percent}%`,
                    bottom: "10px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    backgroundColor: "#f5f5f5",
                    padding: "1px 3px",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                  }}
                >
                  {hour.toString().padStart(2, "0")}
                </div>
              </React.Fragment>
            );
          })}

          {activities.map((activity, index) => {
            const start = timeToNumeric(activity.start);
            const end = timeToNumeric(activity.end);
            if (end <= start) return null;

            const leftPercent = (start / 24) * 100;
            const widthPercent = ((end - start) / 24) * 100;

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: "10px",
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  height: "20px",
                  backgroundColor: COLORS[activity.activity] || "gray",
                  border: "1px solid black",
                  color: "white",
                  textAlign: "center",
                  fontSize: "10px",
                  lineHeight: "20px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                  zIndex: 1,
                }}
                title={`Start: ${activity.start}, End: ${activity.end}`}
              >
                {activity.activity}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          marginTop: "5px",
          fontWeight: "bold",
        }}
      >
        {formatDateLabel(label)}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        paddingTop: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Toggle */}
      <div
        style={{
          width: "180px",
          margin: "30px auto 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ccc",
          borderRadius: "20px",
          padding: "6px",
          cursor: "pointer",
          fontSize: "13px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
        onClick={() => setShowFuture((prev) => !prev)}
      >
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "5px 0",
            backgroundColor: showFuture ? "transparent" : "white",
            borderRadius: "15px",
            fontWeight: showFuture ? "normal" : "bold",
          }}
        >
          Previous
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "5px 0",
            backgroundColor: showFuture ? "white" : "transparent",
            borderRadius: "15px",
            fontWeight: showFuture ? "bold" : "normal",
          }}
        >
          Future
        </div>
      </div>

      {/* Render timelines */}
      {days.map((day) => renderTimeline(getDayActivities(day), day))}

      <h3
        style={{
          textAlign: "center",
          width: "100%",
          marginTop: "1px",
        }}
      >
        Target Date Timeline
      </h3>
    </div>
  );
};

export default Charts;
