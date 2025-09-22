import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventContentArg } from "@fullcalendar/core";
import { EVENTS } from "~/utils/data-loader";
import type { Event } from "~/interfaces/Event";
import { addDays, parseISO, formatISO } from "date-fns";

const EVENT_COLORS = [
  "#E63946", // warm red
  "#457B9D", // muted blue
  "#2A9D8F", // teal/green
  "#8D99AE", // soft gray-blue
  "#F4A261", // soft orange
  "#6A4C93", // purple
  "#1A535C", // dark cyan
  "#FF7F50", // coral
  "#4B3832", // brown
  "#3B6978", // deep teal
];

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
        firstDay={5}
        fixedWeekCount={false}
        events={events.map((e, i) => ({
          title: e.title,
          start: e.start,
          end: formatISO(addDays(parseISO(e.end), 1), {
            representation: "date",
          }), // include last day
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
