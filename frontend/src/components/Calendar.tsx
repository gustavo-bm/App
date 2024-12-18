import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents } from '../api/routes/eventRoute';
import { useEffect, useRef } from 'react';
import IEvent from '../interfaces/IEvent';
import { createEvent, showEventInfo, persistUpdates, removeEvent } from '../services/eventFunctions';

function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchData = async () => {
      const events = await getEvents();
      events.forEach((event: IEvent) => {
        const newEvent = {
          id: event._id?.toString(),
          title: event.name,
          start: event.date,
          allDay: true,
          extendedProps: {
            description: event.description || '',
            location: event.location || ''
          }
        };
        calendarRef.current?.getApi().addEvent(newEvent);
      });
    }

    fetchData();
  }, []);

  const handleDateClick = async (event: any) => {
    createEvent(event);
  };

  const handleEventClick = (info: any) => {
    showEventInfo(info);
  }

  const handleEventChange = async (changeInfo: any) => {
    persistUpdates(changeInfo);
  };

  const handleEventDelete = async (eventInfo: any) => {
    removeEvent(eventInfo);
  }

  const renderEventContent = (eventInfo: any) => {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        <div>
          <button onClick={() => handleEventClick(eventInfo)}>View</button>
          <button onClick={() => handleEventChange(eventInfo)}>Update</button>
          <button onClick={() => handleEventDelete(eventInfo)}>Delete</button>
        </div>
      </div>
    );
  };
  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventContent={renderEventContent} // allows to show buttons on events
      />
    </>
  )
}

export default Calendar;