import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";


export default function EventCalendar() {
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

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventContent={renderEventContent}
    />
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {eventInfo.event.extendedProps.image && (
        <img
          src={eventInfo.event.extendedProps.image}
          alt=""
          style={{ width: 20, height: 20, marginRight: 4 }}
        />
      )}
      <b>{eventInfo.event.title}</b>
    </div>
  );
}
