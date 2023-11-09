import express from "express";
import { validate } from "../helpers/validator";
import {
  getOrganizations,
  getEvents,
  createEvent,
  createTicketClass,
} from "../controllers/eventbrite.controller";
import { EventBriteValidation } from "../validations/eventbrite.validation";

const router = express.Router();

router.route("/organizations").get(getOrganizations);

router
  .route("/events")
  .post(validate(EventBriteValidation.getEvents), getEvents);

router
  .route("/create-event")
  .post(validate(EventBriteValidation.createEvent), createEvent);

router
  .route("/create-ticket-class")
  .post(validate(EventBriteValidation.createTicketClass), createTicketClass);

export default router;
