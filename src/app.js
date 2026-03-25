import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case"
});
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

export default app;
