import axios from "axios";
import {
  EVENTBRITE_ENDPOINTS,
  EVENTBRITE_PRIVATE_TOKEN,
  EVENTBRITE_TIMEZONE,
  EVENTBRITE_CURRENCY,
} from "../config";

export const obtainOrganizations = async () => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        EVENTBRITE_ENDPOINTS.GET_OBTAIN_ORGANIZATION,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    const organizationData = result.data;
    return organizationData.organizations;
  } catch (err) {
    return [];
  }
};

export const obtainEvents = async (organizationId: string) => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        `v3/organizations/${organizationId}/events/`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    const eventsData = result.data;
    return eventsData.events;
  } catch (err) {
    return [];
  }
};

export const createEvent = async (
  organizationId: string,
  name: string,
  start: string,
  end: string
) => {
  try {
    const result = await axios.post(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        `v3/organizations/${organizationId}/events/`,
      {
        event: {
          name: { html: name },
          start: { timezone: EVENTBRITE_TIMEZONE, utc: start },
          end: { timezone: EVENTBRITE_TIMEZONE, utc: end },
          currency: EVENTBRITE_CURRENCY,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const updateEvent = async (eventId: string, eventData: any) => {
  try {
    const result = await axios.post(
      EVENTBRITE_ENDPOINTS.BASE_URI + `v3/events/${eventId}`,
      {
        event: eventData,
      },
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const publishEvent = async (eventId: string) => {
  try {
    const result = await axios.post(
      EVENTBRITE_ENDPOINTS.BASE_URI + `v3/events/${eventId}/publish`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const getEventsByStatus = async (
  organizationId: string,
  status: string
) => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        `v3/organizations/${organizationId}/events/?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const getEventsByDate = async (
  organizationId: string,
  timeFilter: string
) => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        `v3/organizations/${organizationId}/events/?time_filter=${timeFilter}`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const setEventSummary = async (eventId: string, description: any) => {
  try {
    const result = await axios.post(
      EVENTBRITE_ENDPOINTS.BASE_URI + `v3/events/${eventId}/`,
      {
        event: {
          description,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const getEventDescription = async (eventId: string) => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        `v3/events/${eventId}/structured_content/?purpose=listing`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const createTicketClass = async (eventId: string, config: any) => {
  try {
    const result = await axios.post(
      EVENTBRITE_ENDPOINTS.BASE_URI + `v3/events/${eventId}/ticket_classes/`,
      {
        ticket_class: config,
      },
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const getTicketClasses = async (eventId: string) => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        `v3/events/${eventId}/?expand=ticket_classes`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const listEventOrders = async (eventId: string) => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI + `v3/events/${eventId}/orders`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};

export const getOrderAttendees = async (eventId: string) => {
  try {
    const result = await axios.get(
      EVENTBRITE_ENDPOINTS.BASE_URI +
        `v3/events/${eventId}orders/expand=attendees`,
      {
        headers: {
          Authorization: `Bearer ${EVENTBRITE_PRIVATE_TOKEN}`,
        },
      }
    );
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false };
  }
};
