import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { postEvent } from '../api/routes/eventRoute';

function Calendar() {
    const handleDateClick = async (arg: any) => {
        const title: string | null = prompt('Enter event title:');
        if (title) {
          const description: string | null = prompt('Enter event description:');
          const location: string | null = prompt('Enter event location:');
          // it makes the event appear locally
          const newEvent = {
            title,
            start: arg.date,
            allDay: arg.allDay
          };
          
          arg.view.calendar.addEvent(newEvent);
    
          // it has to post on the 
           // it has to post on the server
        try {
          await postEvent({
            name: title,
            description: description || '',
            date: arg.date,
            location: location || ''
          });
          console.log('Event posted successfully');
        } catch (error) {
          console.error('Error posting event:', error);
        }
          }
    };
    
      return (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
          />
        </>
      )
}

export default Calendar;