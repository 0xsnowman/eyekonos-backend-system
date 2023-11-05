import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { UserVerify } from "../models/user-verify.model";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";
import { transporter } from "../helpers/mailer";
import {
  BadRequestError,
  ForbiddenError,
  InternalError,
} from "../core/api-error";
import { generateString } from "../utils/generate-string";

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new BadRequestError("User email or password is incorrect");
    }
    if (validPassword(password, foundUser.password)) {
      throw new BadRequestError("User email or password is incorrect");
    }
    if (!foundUser.isVerified) {
      throw new ForbiddenError("Please Verify your email first");
    }
    const token = generateJWT(foundUser.toObject());
    return res
      .status(httpStatus.OK)
      .json({ message: "Welcome", data: { token, user: foundUser } });
  } catch (error) {
    return next(error);
  }
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
    const token = generateJWT(savedUser.toObject());
    return res.status(httpStatus.OK).json({
      message: "Registered successfully",
      data: { token, user: savedUser },
    });
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

const generateJWT = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
};
