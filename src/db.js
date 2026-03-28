import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case"
});

/**
  Registers a new user with the given information.

  @param {string} username
  @param {string} password
  @param {string} email
  @param {string} phone
*/
export function registerUser(username, password, email, phone) {}

/**
  Returns a new user object from the database using the given userId.

  @param {number} userId
*/
export function getUserById(userId) {}

/**
  Returns a list of users that match a given query.

  @param {{
    q: string;
    limit: number;
    page: number;
  }?} queryData
*/
export function getUsers(queryData) {}
