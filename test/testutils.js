import { expect } from "vitest";
import request from "supertest";
import session from "supertest-session";
import app from "../src/app.js";

/**
  Begins a supertest session using the app.

  Darn, this took a lot of time to figure this out...
*/
export async function login() {
  const agent = request.agent(app);
  await agent.post("/auth")
  .send({
    email: "janedoe@example.com",
    password: "1234abcd!@#$"
  })
  .expect(200);
  return agent;
}

/**
  Begins an administrator supertest session using the app.
*/
export async function loginAsAdmin() {
  const agent = request.agent(app);
  await agent.post("/auth")
  .send({
    email: "johndoe@example.com",
    password: "sUpRDupRS3cUr3Ad31nPasS"
  })
  .expect(200);
  return agent;
}

/**
  Begins an owner supertest session using the app.
*/
export async function loginAsOwner() {
  const agent = request.agent(app);
  await agent.post("/auth")
  .send({
    email: "djavid@example.com",
    password: "sUpRDupRS3cUr3OWNERPasS"
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
