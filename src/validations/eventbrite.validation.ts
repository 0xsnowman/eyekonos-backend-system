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
};
