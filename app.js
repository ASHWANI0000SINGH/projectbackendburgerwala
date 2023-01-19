import express, { urlencoded } from "express";
import dotenv from "dotenv";
const app=express();
export default app;
import {connectPassport} from "./utils/Provider.js"
import session, { Cookie } from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from "cors";



dotenv.config({
    path:"./config/config.env",
})


//using middlewares

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none",
      },
    })
  );

  app.use(cookieParser());

  app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);


app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

  app.use(passport.authenticate("session"));
  app.use(passport.initialize());
  app.use(passport.session());
  app.enable("trust proxy");

connectPassport();

//importing routes

import UserRoute from "./routes/user.js"
import OrderRoute from "./routes/order.js"


app.use("/api/v1",UserRoute);
app.use("/api/v1",OrderRoute);



// middle ware
app.use(errorMiddleware);
