import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { UserVerify } from "../models/user-verify.model";
import { OAuthClientModel } from "../modules/oauth/model";
import { transporter } from "../helpers/mailer";
import { BadRequestError, InternalError } from "../core/api-error";
import { generateString } from "../utils/generate-string";

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    return res
      .status(400)
      .json({ message: "User email or password is incorrect" });
  }
  if (!validPassword(password, foundUser.password)) {
    return res
      .status(400)
      .json({ message: "User email or password is incorrect" });
  }
  if (!foundUser.isVerified) {
    return res.status(403).json({ message: "Please Verify your email first" });
  }
  const oauthClient = await OAuthClientModel.findOne({ user: foundUser._id });
  if (oauthClient) {
    req.body.client_id = oauthClient.clientId;
    req.body.client_secret = oauthClient.clientSecret;
    req.body.username = email;
    req.body.grant_type = "password";
  }
  return next();
}

export async function signupHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      throw new BadRequestError("Email already exists");
    }
    const user = new User({
      email,
      password,
    });
    user.password = generatePassword(password);
    const savedUser = await user.save();
    const sent = await sendVerifyCodeToEmail(email);
    if (sent)
      return res.status(httpStatus.OK).json({
        message: "Registered successfully",
        data: { user: savedUser },
      });
    else
      throw new InternalError(
        "There was an error during sending email verification code"
      );
  } catch (error) {
    return next(error);
  }
}

export async function verifyEmailHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.body;
  try {
    const verifyToken = await UserVerify.findOne({ token });
    if (!verifyToken) {
      throw new BadRequestError("Verification code not found");
    }
    const foundUser = await User.findById(verifyToken.owner);
    if (!foundUser) {
      throw new BadRequestError("User not exist");
    }
    foundUser.isVerified = true;
    const savedUser = await foundUser.save();
    const oauthClient = new OAuthClientModel({
      user: foundUser._id,
      clientId: generateString(30),
      clientSecret: generateString(50),
      grants: ["password", "refresh_token"],
      redirectUris: [],
    });
    await oauthClient.save();
    await UserVerify.deleteOne({ token });
    return res.status(httpStatus.OK).json({
      message: "Verified email successfully",
      data: { user: savedUser },
    });
  } catch (error) {
    return next(error);
  }
}

export async function resendVerifyCodeToEmailHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;
  try {
    const sent = await sendVerifyCodeToEmail(email);
    if (sent) {
      return res.json({
        status: "success",
        message: "Email Verification Code sent successfully",
        data: null,
      });
    }
    throw new InternalError(
      "There was an error during sending email verification code"
    );
  } catch (error) {
    return next(error);
  }
}

async function sendVerifyCodeToEmail(email: string) {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return false;
    }
    const token = generateString(6);
    const verifyUser = new UserVerify({
      owner: user._id,
      token,
    });
    await verifyUser.save();
    const mailOptions = {
      from: "chakus.superdev@gmail.com",
      to: email,
      subject: "Email Verification Code",
      text: `Your email verification code is here. ${token}`,
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
}

const generatePassword = (password: string) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

const validPassword = (password: string, hashed: string) => {
  return bcrypt.compareSync(password, hashed);
};
