import "dotenv/config";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./db/schema.js";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case"
});

//
// Please note that these functions only handle database operations. They don't
// handle anything else besides that. Please handle things like password
// hashing and validation outside of this file.
//

/**
  @typedef {Object} User
  @property {number} id
  @property {string} email
  @property {string} phone
  @property {string} username
*/

/**
  Registers a new user with the given information.

  @param {string} username
  @param {string} passwordHash
  @param {string} email
  @param {string} phone
*/
export async function registerUser(username, passwordHash, email, phone) {
  await db.insert(users)
  .values({
    username,
    password: passwordHash,
    email,
    phone
  });
}

/**
  Attempts to obtain a user with the given email and password hash.

  @param {string} email
  @param {string} password
  @return {User?}
*/
export async function authenticateUser(email, password) {
  const result = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      password: users.password,
      phone: users.phone
    })
  .from(users)
  .where(eq(users.email, email));

  const passwordMatches = await bcrypt.compare(password, result.password);
  if (passwordMatches) {
    return {
      id: result.id,
      username: result.username,
      email: result.email,
      phone: result.phone
    };
  }

  return null;
}

/**
  Attempts to update the given user with the given data.

  @param {number} userId
  @param {User?} newData
*/
export async function updateUser(userId, newData) {
  if (newData) {
    await db.update(users)
    .set({
      ...(newData.username ? { username: newData.username } : {}),
      ...(newData.password ? { username: newData.password } : {}),
      ...(newData.email ? { username: newData.email } : {}),
      ...(newData.phone ? { username: newData.phone } : {})
    })
    .where(eq(users.id, userId));
  }
}

/**
  Attempts to delete the user with the given userId.

  @param {number} userId
  @return {User?}
*/
export async function deleteUser(userId) {
  return await db.delete(users)
  .where(eq(users.id, userId));
}

/**
  Returns a new user object from the database using the given userId.

  @param {number} userId
  @return {User?}
*/
export async function getUserById(userId) {
  return await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      phone: users.phone
    })
  .from(users)
  .where(eq(users.id, userId));
}

/**
  Returns a list of users that match a given query.

  @param {{
    q: string;
    limit: number;
    page: number;
  }?} queryData
  @return {Array<User>}
*/
export async function getUsers(queryData) {
  const { q = "", limit = 50, page = 0 } = queryData;
  const result = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      phone: users.phone
    })
  .from(users)
  .limit(Number(limit))
  .offset(Number(limit) * Number(page));

  return result || [];
}

/**
  Returns the priveleges of the user with the given userId.

  @param {number} userId
  @return {string?}
*/
export async function getUserPriveleges(userId) {
  const result = await db.select({
      role: users.role
    })
  .from(users)
  .where(eq(users.id, userId));
  return result;
}
