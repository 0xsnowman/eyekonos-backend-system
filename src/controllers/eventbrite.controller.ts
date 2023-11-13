import { Response, NextFunction } from "express";
import { CRequest } from "../core/api-custom";
import httpStatus from "http-status";
import { InternalError, BadRequestError } from "../core/api-error";
import { Events } from "../models/events.model";
import { Tickets } from "../models/tickets.model";
import {
  obtainOrganizations,
  obtainEvents,
  createEvent as createEventService,
  createTicketClass as createTicketClassService,
  updateEvent as updateEventService,
  publishEvent as publishEventService,
  getEventsByStatus as getEventsByStatusService,
  getEventsByDate as getEventsByDateService,
  setEventSummary as setEventSummaryService,
  getEventDescription as getEventDescriptionService,
  getTicketClasses as getTicketClassesService,
  listEventOrders as listEventOrdersService,
  getOrderAttendees as getOrderAttendeesService,
} from "../services/eventbrite.service";
import { generateString } from "../utils/generate-string";

export const getOrganizations = async (req: CRequest, res: Response) => {
  const organizations = await obtainOrganizations();
  return res.status(httpStatus.OK).json({ organizations });
};

export const getEvents = async (req: CRequest, res: Response) => {
  const { organizationId } = req.body;
  const events = await obtainEvents(organizationId);
  return res.status(httpStatus.OK).json({ events });
};

export const createEvent = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, name, start, end } = req.body;
    const user = req.user.id;
    const result = await createEventService(organizationId, name, start, end);
    if (!result.success) {
      next(new InternalError("Something went wrong during creating event"));
    }
    const {
      id,
      locale,
      status,
      url,
      resource_uri,
      changed,
      capacity,
      organizer_id,
    } = result.data;
    const event = new Events({
      user: user._id,
      name,
      startDate: start,
      endDate: end,
      location: locale,
      eventId: id,
      eventStatus: status,
      eventUrl: url,
      eventResourceUrl: resource_uri,
      nftOrganization: organizer_id,
      ticketSupply: capacity,
      lastTicketClassUpdate: changed,
    });
    const savedEvent = await event.save();
    return res.status(httpStatus.OK).json({ event: savedEvent });
  } catch (err) {
    next(err);
  }
};

export const createTicketClass = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, name, cost, quantityTotal } = req.body;
    const user = req.user.id;
    const event = await Events.findOne({ eventId });
    if (!event) {
      return next(
        new BadRequestError("Cannot find event with specified event id")
      );
    }
    let config: any = {
      name,
      quantity_total: quantityTotal,
    };
    let isFree = true;
    if (cost) {
      isFree = false;
      config.cost = cost;
    }
    const result = await createTicketClassService(eventId, config);
    if (!result.success) {
      return next(
        new InternalError("Something went wrong during creating ticket class")
      );
    }
    const claimCode = generateString(10);
    const { id, event_id, capacity, category, resource_uri } = result.data;
    const ticket = new Tickets({
      user: user._id,
      event: event._id,
      originalTicketId: id,
      eventId: event_id,
      seatNumber: capacity,
      recipientEmail: user.email,
      resourceURL: resource_uri,
      claimCode: claimCode,
      ticketType: category,
      cost: isFree ? "free" : cost,
    });
    event.ticketSupply = event.ticketSupply + capacity;
    const savedTicket = await ticket.save();
    const savedEvent = await event.save();
    return res
      .status(httpStatus.OK)
      .json({ ticket: savedTicket, event: savedEvent });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, eventData } = req.body;
    const result = await updateEventService(eventId, eventData);
    if (!result.success) {
      next(new InternalError("Something went wrong during updating event"));
    }
    const { locale, status, url, start, end, resource_uri, changed, capacity } =
      result.data;
    const eventStore = await Events.findOne({ eventId });
    if (eventStore) {
      eventStore.location = locale;
      eventStore.startDate = start.utc;
      eventStore.endDate = end.utc;
      eventStore.eventStatus = status;
      eventStore.eventUrl = url;
      eventStore.eventResourceUrl = resource_uri;
      eventStore.ticketSupply = capacity;
      eventStore.lastTicketClassUpdate = changed;
      const savedEvent = await eventStore.save();
      return res.status(httpStatus.OK).json({ event: savedEvent });
    }
    next(new InternalError("Something went wrong during updating event"));
  } catch (err) {
    next(err);
  }
};

export const publishEvent = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.body;
    const result = await publishEventService(eventId);
    if (!result.success) {
      next(new InternalError("Something went wrong during updating event"));
    }
    return res
      .status(httpStatus.OK)
      .json({ message: "Published an event successfully" });
  } catch (err) {
    next(err);
  }
};

export const getEventsByStatus = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, status } = req.body;
    const result = await getEventsByStatusService(organizationId, status);
    if (!result.success) {
      next(new InternalError("Something went wrong during fetching events"));
    }
    return res.status(httpStatus.OK).json({ data: result.data });
  } catch (err) {
    next(err);
  }
};

export const getEventsByDate = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { organizationId, timeFilter } = req.body;
    const result = await getEventsByDateService(organizationId, timeFilter);
    if (!result.success) {
      next(new InternalError("Something went wrong during fetching events"));
    }
    return res.status(httpStatus.OK).json({ data: result.data });
  } catch (err) {
    next(err);
  }
};

export const setEventSummary = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId, description } = req.body;
    const result = await setEventSummaryService(eventId, description);
    if (!result.success) {
      next(
        new InternalError("Something went wrong during updating event summary")
      );
    }
    return res.status(httpStatus.OK).json({ data: result.data });
  } catch (err) {
    next(err);
  }
};

export const getEventDescription = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.body;
    const result = await getEventDescriptionService(eventId);
    if (!result.success) {
      next(
        new InternalError(
          "Something went wrong during fetching event description"
        )
      );
    }
    return res.status(httpStatus.OK).json({ data: result.data });
  } catch (err) {
    next(err);
  }
};

export const getTicketClasses = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.body;
    const result = await getTicketClassesService(eventId);
    if (!result.success) {
      next(
        new InternalError("Something went wrong during fetching ticket classes")
      );
    }
    return res.status(httpStatus.OK).json({ data: result.data });
  } catch (err) {
    next(err);
  }
};

export const listEventOrders = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.body;
    const result = await listEventOrdersService(eventId);
    if (!result.success) {
      next(
        new InternalError(
          "Something went wrong during fetching orders from event"
        )
      );
    }
    return res.status(httpStatus.OK).json({ data: result.data });
  } catch (err) {
    next(err);
  }
};

export const getOrderAttendees = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventId } = req.body;
    const result = await getOrderAttendeesService(eventId);
    if (!result.success) {
      next(
        new InternalError(
          "Something went wrong during fetching attendees from event"
        )
      );
    }
    return res.status(httpStatus.OK).json({ data: result.data });
  } catch (err) {
    next(err);
  }
};
