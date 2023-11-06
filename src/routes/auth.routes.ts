import express from "express";
import { validate } from "../helpers/validator";
import {
  loginHandler,
  signupHandler,
  verifyEmailHandler,
  resendVerifyCodeToEmailHandler,
} from "../controllers/auth.controller";
import { AuthValidation } from "../validations/auth.validation";
import { oauth } from "../modules/oauth/oauth";

const router = express.Router();

router
  .route("/login")
  .post(validate(AuthValidation.login), loginHandler, oauth.grant());

router.route("/signup").post(validate(AuthValidation.signup), signupHandler);

router
  .route("/verify-email")
  .post(validate(AuthValidation.verifyEmail), verifyEmailHandler);

router
  .route("/resend-verification-code")
  .post(
    validate(AuthValidation.resendEmailVerification),
    resendVerifyCodeToEmailHandler
  );

router.get("/check-oauth", oauth.authorise(), (req, res, next) => {
  res.json("Got information successfully");
});

export default router;
