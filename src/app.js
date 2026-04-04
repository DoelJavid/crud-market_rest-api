import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import checkoutRouter from "./routes/checkout.js";
import ordersRouter from "./routes/orders.js";
import "./passport.js";

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use(session({
  secret: "Keyboard Cat",
  saveUninitialized: true,
  resave: true,
  rolling: true,
  cookie: {
    path: "/",
    secure: false, // Enable this for production environments.
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

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;
