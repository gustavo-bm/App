import IEvent from "../../interfaces/IEvent";
import api from "../axiosConfig";

const getEvents = async () => {
  try {
    const response = await api.get("/events/");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const postEvent = async (event: IEvent) => {
  try {
    await api.post("/events", event);
    console.log('Event posted:', event);
  } catch (error) {
    console.error('Error posting event:', error);
  }
};

const updateEvent = async (id: string, event: IEvent) => {
  try {
    await api.put(`/events/${id}`, event);
    console.log('Event updated:', event);
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

const deleteEvent = async (id: string) => {
  try {
    await api.delete(`/events/${id}`);
    console.log('Event deleted');
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}

export {
  getEvents,
  postEvent,
  updateEvent,
  deleteEvent
}