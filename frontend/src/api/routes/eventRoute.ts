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

export {
    getEvents,
    postEvent
}