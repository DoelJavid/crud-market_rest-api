import * as z from "zod";

/**
  Validates the given email address and throws if the email isn't valid.

  @param {string} email
  @return {boolean}
*/
export function validateEmail(email) {
  return z.email().parse(email);
}

/**
  Validates the given phone number and throws if the number isn't valid.

  @param {string} phone
  @return {string}
*/
export function validatePhone(phone) {
  if (typeof phone !== "string") {
    throw new Error("Phone number should be a string!");
  }

  const phoneValid = /\d{3}-\d{3}-\d{4}/
  if (!phoneValid) {
    throw new Error("Phone number should be a valid US phone number!");
  }

  return phone;
}

/**
  Validates the given username and throws if the username isn't valid.

  @param {string} username
  @return {string}
*/
export function validateUsername(username) {
  return z.string()
  .min(3)
  .max(32)
  .regex(/^[a-zA-Z0-9_]+$/i)
  .parse(username);
}

/**
  Validates the given password and throws if the password isn't valid.

  @param {string} password
  @return {string}
*/
export function validatePassword(password) {
  return z.string()
  .min(8)
  .max(60)
  .parse(password);
}
