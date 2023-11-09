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
