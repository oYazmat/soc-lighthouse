import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";

export default function EventCalendar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // only render calendar after mount
  }, []);

  const events = [
    {
      title: "Dragon Quest X Event",
      start: "2025-08-29",
      end: "2025-09-11",
      extendedProps: { image: "/images/events/test.png" },
    },
    {
      title: "Early Access",
      start: "2025-09-04",
      end: "2025-09-17",
      color: "orange",
    },
  ];

  if (!mounted) return null; // don't render until mounted

  return (
    <div style={{ height: "100vh" }}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
        height="100%"
        contentHeight="auto"
        dayMaxEventRows={3}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
      />
    </div>
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <div style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
      {eventInfo.event.extendedProps.image && (
        <img
          src={eventInfo.event.extendedProps.image}
          alt=""
          style={{ width: 16, height: 16, marginRight: 4 }}
        />
      )}
      <b>{eventInfo.event.title}</b>
    </div>
  );
}
