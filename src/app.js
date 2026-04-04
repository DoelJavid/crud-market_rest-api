import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import Sqlite from "better-sqlite3";
import SqliteStore from "better-sqlite3-session-store";
import passport from "passport";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkout.js";
import ordersRouter from "./routes/orders.js";
import "./passport.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const app = express();
let sessionStore;

if (IS_PRODUCTION) {
  const sessionDB = new Sqlite("sessions.db");
  // Now here's some strange black magic for ya.
  sessionStore = new(SqliteStore(session))({
    client: sessionDB
  })
}

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  rolling: true,
  store: sessionStore,
  cookie: {
    path: "/",
    secure: IS_PRODUCTION,
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: "strict"
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", usersRouter);
app.use("/", productsRouter);
app.use("/", cartRouter);
app.use("/", checkoutRouter);
app.use("/", ordersRouter);

export default app;
