import { deleteEvent, postEvent, updateEvent } from "../api/routes/eventRoute";

export const createEvent = async (event: any) => {
    const title: string | null = prompt('Enter event title:');
    if (title) {
      const description: string | null = prompt('Enter event description:');
      const location: string | null = prompt('Enter event location:');

      // it makes the event appear locally
      const newEvent = {
        title,
        start: event.date,
        allDay: event.allDay,
        extendedProps: {
          description: description || '',
          location: location || ''
        }
      };

      event.view.calendar.addEvent(newEvent);

      // it has to post on the server
      try {
        await postEvent({
          name: title,
          description: description || '',
          date: event.date,
          location: location || ''
        });
        console.log('Event posted successfully');
      } catch (error) {
        console.error('Error posting event:', error);
      }
    }
}

export const showEventInfo = async (info: any) => {
    const event = info.event;
    alert(`Event: ${event.title}\nDescription: ${event.extendedProps.description}\nLocation: ${event.extendedProps.location}`);
}

export const persistUpdates = async (changeInfo: any) => {
  const event = changeInfo.event;
    const newTitle = prompt('Enter new event title:', event.title);
    if (newTitle) {
      const newDescription = prompt('Enter new event description:', event.extendedProps.description);
      const newLocation = prompt('Enter new event location:', event.extendedProps.location);

      // Update event locally
      event.setProp('title', newTitle);
      event.setExtendedProp('description', newDescription || '');
      event.setExtendedProp('location', newLocation || '');

      // Update event on the server
      try {
        await updateEvent(event.id, {
          _id: event.id,
          name: newTitle,
          description: newDescription || '',
          date: event.start,
          location: newLocation || ''
        });
        console.log('Event updated successfully');
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
}

export const removeEvent = async (info: any) => {
  const event = info.event;
    if (window.confirm(`Are you sure you want to delete the event "${event.title}"?`)) {
      event.remove();
      try {
        await deleteEvent(event.id);
        console.log('Event deleted successfully', event.id);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
}