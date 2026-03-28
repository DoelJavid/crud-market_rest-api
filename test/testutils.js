import { expect } from "vitest";
import session from "supertest-session";
import app from "../src/app.js";

/**
  Begins a supertest session using the app.

  NOTE: The regular user login is the following:
  ```
  {
    email: "johndoe@example.com",
    password: "1234abcd!@#$"
  }
  ```
*/
export function login() {
  return session(app)
  .post("/auth")
  .send({
    email: "johndoe@example.com",
    password: "1234abcd!@#$"
  });
}

/**
  Begins an administrator supertest session using the app.

  NOTE: The admin user login is the following:
  ```
  {
    email: "djavid@example.com",
    password: "sUpRDupRS3cUr3Ad31nPasS"
  }
  ```
*/
export function loginAsAdmin() {
  return session(app)
  .post("/auth")
  .send({
    email: "djavid@example.com",
    password: "sUpRDupRS3cUr3Ad31nPasS"
  });
}

/**
  Checks whether or not the given user is valid.
*/
export function expectValidUser(userdata) {
  expect(userdata).toMatchTable({
    email: expect.any(String),
    phone: expect.any(String),
    username: expect.any(String)
  });
}
