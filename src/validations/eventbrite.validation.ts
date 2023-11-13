import { Joi } from "express-validation";

export const EventBriteValidation = {
  createEvent: {
    body: Joi.object({
      organizationId: Joi.string().required(),
      name: Joi.string().required(),
      start: Joi.date().required(),
      end: Joi.date().required(),
    }),
  },
  getEvents: {
    body: Joi.object({
      organizationId: Joi.string().required(),
    }),
  },
  createTicketClass: {
    body: Joi.object({
      eventId: Joi.string().required(),
      name: Joi.string().required(),
      quantityTotal: Joi.number().required(),
      cost: Joi.string().optional(),
    }),
  },
  updateEvent: {
    body: Joi.object({
      eventId: Joi.string().required(),
      eventData: Joi.any().required(),
    }),
  },
  publishEvent: {
    body: Joi.object({
      eventId: Joi.string().required(),
    }),
  },
  getEventsByStatus: {
    body: Joi.object({
      organizationId: Joi.string().required(),
      status: Joi.string().required(),
    }),
  },
  getEventsByDate: {
    body: Joi.object({
      organizationId: Joi.string().required(),
      timeFilter: Joi.string().required(),
    }),
  },
  setEventSummary: {
    body: Joi.object({
      eventId: Joi.string().required(),
      description: Joi.string().required(),
    }),
  },
  getEventDescription: {
    body: Joi.object({
      eventId: Joi.string().required(),
    }),
  },
  getTicketClasses: {
    body: Joi.object({
      eventId: Joi.string().required(),
    }),
  },
  listEventOrders: {
    body: Joi.object({
      eventId: Joi.string().required(),
    }),
  },
  getOrderAttendees: {
    body: Joi.object({
      eventId: Joi.string().required(),
    }),
  },
};
