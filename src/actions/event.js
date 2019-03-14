import regApi from "../apis/registration";
import { EVENT_GET } from "../reducers/event";

export const getEvent = callback => async dispatch => {
  const eventId = process.env.REACT_APP_EVENT_ID;
  try {
    const response = await regApi().get(`/events/${eventId}`);
    const payload = { event: response.data };
    dispatch({
      type: EVENT_GET,
      payload
    });
    if (callback) callback(null, payload);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};
