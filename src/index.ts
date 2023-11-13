import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import helmet from "helmet";
import logger from "morgan";
import { CORS_URL, NODE_ENV, MONGO_URL } from "./config";
import {
  NotFoundError,
  ApiError,
  InternalError,
  ErrorType,
} from "./core/api-error";
import router from "./routes";

mongoose.Promise = Promise;

async function startServer() {
  const app = express();

  app.use(logger("dev"));

  app.use(express.json({ limit: "50mb" }));
  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 1000000,
    })
  );

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(cors({ origin: CORS_URL, optionsSuccessStatus: 200 }));
  app.use(express.static(path.resolve(__dirname, "./public")));
  app.use(fileUpload());

  app.use("/", router);

  app.use(helmet());

  app.use((req, res, next) => next(new NotFoundError()));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      ApiError.handle(err, res);
      if (err.type === ErrorType.INTERNAL)
        console.log(
          `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
        );
    } else {
      console.log(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
      );
      console.log(err);
      if (NODE_ENV === "development") {
        return res.status(500).send(err);
      }
      ApiError.handle(new InternalError(), res);
    }
  });

  mongoose.connect(MONGO_URL || "").then(() => {
    console.log("MONGODB CONNECTED");
  });

  mongoose.connection.on("error", () => {
    throw new Error(`unable to connect to database: ${MONGO_URL}`);
  });

  app.listen(process.env.PORT, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  );
}

startServer();

process.on("uncaughtException", (e) => {
  console.log(e);
});
