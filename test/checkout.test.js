import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { login } from "./testutils.js";

describe("POST /checkout", () => {
  it("Returns 201 for a successful checkout", async () => {
    const agent = await login();

    // Example card numbers found here:
    // https://docs.payload.com/apis/payments/test-cards/
    const res = await agent.post("/checkout")
    .send({
      cardNumber: "4242 4242 4242 4242",
      cvv: "999",
      cardSignature: "JANE DOE",
      billingAddress: {
        city: "Springfield",
        state: "Ohio",
        address: "5555 Example Dr.",
        zip: "99999"
      },
      shippingAddress: {
        city: "Springfield",
        state: "Ohio",
        address: "5454 Example Dr.",
        zip: "99991"
      }
    });

    expect(res.status).toStrictEqual(201);
  });

  it("Returns 201 if only billingAddress is filled", async () => {
    // NOTE: If shippingAddress isn't filled, it defaults to billingAddress.

    const agent = await login();

    const res = await agent.post("/checkout")
    .send({
      cardNumber: "4242 4242 4242 4242",
      cvv: "999",
      cardSignature: "JANE DOE",
      billingAddress: {
        city: "Springfield",
        state: "Ohio",
        address: "5555 Example Dr.",
        zip: "99999"
      }
    });

    expect(res.status).toStrictEqual(201);
  });

  it("Returns 400 for missing payment information", async () => {
    const agent = await login();

    const res = await agent.post("/checkout")
    .send({
      cardNumber: "4242 4242 4242 4242",
      billingAddress: {
        city: "Springfield",
        state: "Ohio",
        address: "5555 Example Dr.",
        zip: "99999"
      }
    });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 for missing address information", async () => {
    const agent = await login();

    const res = await agent.post("/checkout")
    .send({
      cardNumber: "4242 4242 4242 4242",
      billingAddress: {
        city: "Springfield",
        state: "Ohio",
        zip: "99999"
      }
    });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 for invalid payment information", async () => {
    const agent = await login();

    const res = await agent.post("/checkout")
    .send({
      cardNumber: "4242 4242 4242 1242",
      cvv: "999",
      cardSignature: "JANE DOE",
      billingAddress: {
        city: "Springfield",
        state: "Ohio",
        address: "5555 Example Dr.",
        zip: "99999"
      }
    });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 403 when user isn't authenticated", async () => {
    const res = await request(app)
    .post("/checkout")
    .send({
      cardNumber: "4242 4242 4242 4242",
      cvv: "999",
      cardSignature: "JANE DOE",
      billingAddress: {
        city: "Springfield",
        state: "Ohio",
        address: "5555 Example Dr.",
        zip: "99999"
      }
    });

    expect(res.status).toStrictEqual(403);
  });
});
