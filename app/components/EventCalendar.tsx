import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";
import { EVENTS } from "~/utils/data-loader";
import type { Event } from "~/interfaces/Event";

const EVENT_COLORS = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6A4C93", "#FFA07A"]; // 5 colors

export default function EventCalendar() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setMounted(true);
    setEvents(EVENTS);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ height: "100vh" }}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map((e, i) => ({
          title: e.title,
          start: e.start,
          end: e.end,
          extendedProps: { image: e.image },
          color: EVENT_COLORS[i % EVENT_COLORS.length],
        }))}
        eventContent={renderEventContent}
        height="100%"
        contentHeight="auto"
        dayMaxEventRows={Infinity} // show all events, no "+X more"
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
