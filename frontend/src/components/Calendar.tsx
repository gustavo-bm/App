import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createEvent, showEventInfo, persistUpdates, removeEvent } from '../services/eventFunctions';
import { getEvents } from '../api/routes/eventRoute';
import { useEffect, useRef } from 'react';
import IEvent from '../interfaces/IEvent';

import '../styles/Calendar.css';

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
      <div className='event-content'>
        <p>{eventInfo.event.title}</p>
        <div className='event-buttons'>
          <button className='event-button view' onClick={() => handleEventClick(eventInfo)}>View</button>
          <button className='event-button update' onClick={() => handleEventChange(eventInfo)}>Update</button>
          <button className='event-button delete' onClick={() => handleEventDelete(eventInfo)}>Delete</button>
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
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
        }}
        editable={true}
        dateClick={handleDateClick}
        eventContent={renderEventContent} // allows to show buttons on events
      />
    </>
  )
}

export default Calendar;