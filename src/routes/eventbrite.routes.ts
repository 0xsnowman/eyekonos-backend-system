import express from "express";
import { validate } from "../helpers/validator";
import {
  getOrganizations,
  getEvents,
  createEvent,
  createTicketClass,
  updateEvent,
  publishEvent,
  getEventsByStatus,
  getEventsByDate,
  setEventSummary,
  getEventDescription,
  getTicketClasses,
  listEventOrders,
  getOrderAttendees,
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

router
  .route("/update-event")
  .post(validate(EventBriteValidation.updateEvent), updateEvent);

router
  .route("/publish-event")
  .post(validate(EventBriteValidation.publishEvent), publishEvent);

router
  .route("/get-events-by-status")
  .post(validate(EventBriteValidation.getEventsByStatus), getEventsByStatus);

router
  .route("/get-events-by-date")
  .post(validate(EventBriteValidation.getEventsByDate), getEventsByDate);

router
  .route("/set-event-summary")
  .post(validate(EventBriteValidation.setEventSummary), setEventSummary);

router
  .route("/get-event-description")
  .post(
    validate(EventBriteValidation.getEventDescription),
    getEventDescription
  );

router
  .route("/get-ticket-classes")
  .post(validate(EventBriteValidation.getTicketClasses), getTicketClasses);

router
  .route("/list-orders")
  .post(validate(EventBriteValidation.listEventOrders), listEventOrders);

router
  .route("/get-order-attendees")
  .post(validate(EventBriteValidation.getOrderAttendees), getOrderAttendees);

export default router;
