import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import usersRouter from "./routes/users.js";

const app = express();

app.use("/", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;
