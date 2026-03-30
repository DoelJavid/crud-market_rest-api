import { expect } from "vitest";
import request from "supertest";
import session from "supertest-session";
import app from "../src/app.js";

export const sampleUser = {
  id: 2,
  email: "johndoe@example.com",
  phone: "777-777-7777",
  username: "JohnDoe"
};

export const sampleUserWithPassword = {
  ...sampleUser,
  password: "1234abcd!@#$"
};

export const sampleAdmin = {
  id: 1,
  email: "djavid@example.com",
  phone: "555-555-5555",
  username: "DoelJavid"
};

export const sampleAdminWithPassword = {
  ...sampleAdmin,
  password: "sUpRDupRS3cUr3Ad31nPasS"
};

/**
  Begins a supertest session using the app.

  NOTE: The regular user login is the following:
  ```
  {
    email: "johndoe@example.com",
    password: "1234abcd!@#$"
  }
  ```

  Darn, this took a lot of time to figure this out...
*/
export async function login() {
  const agent = request.agent(app);
  await agent.post("/auth")
  .send({
    email: "johndoe@example.com",
    password: "1234abcd!@#$"
  })
  .expect(200);
  return agent;
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
export async function loginAsAdmin() {
  const agent = request.agent(app);
  await agent.post("/auth")
  .send({
    email: "djavid@example.com",
    password: "sUpRDupRS3cUr3Ad31nPasS"
  })
  .expect(200);
  return agent;
}

/**
  Checks whether or not the given user is valid.
*/
export function expectValidUser(userdata) {
  expect(userdata).toMatchObject({
    email: expect.any(String),
    phone: expect.any(String),
    username: expect.any(String)
  });
}
