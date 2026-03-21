import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case"
});
const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
