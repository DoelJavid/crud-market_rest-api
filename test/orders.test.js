import { describe, it, expect, expectTypeOf } from "vitest";
import request from "supertest";
import * as z from "zod";
import app from "../src/app.js";
import {
  login,
  loginAsAdmin
} from "./testutils.js";

const OrdersObject = z.strictObject({
  items: z.array(z.strictObject({
    productName: z.string(),
    quantity: z.number().positive().int(),
    price: z.number().positive()
  })),
  deliverTo: z.strictObject({
    city: z.string().regex(/[a-z]+/i),
    state: z.string().regex(/[a-z]+/i),
    address: z.string().regex(/[0-9]{4} [a-z]+ [a-z]+%.?/)
  })
});

describe("GET /orders", () => {
  it("Returns 200 with orders when successful", async () => {
    const agent = await login();

    const res = agent.get("/orders")
    .send();

    expect(res.status).toStrictEqual(200);
    expectTypeOf(res.body).toBeArray();
    expect(res.body[0]).toMatchSchema(OrdersObject);
  });

  it("Returns 403 when not authenticated", async () => {
    const res = request(app)
    .get("/orders")
    .send();

    expect(res.status).toStrictEqual(403);
  });
});

describe("GET /orders/all", () => {
  it("Returns 200 with orders when successful", async () => {
    const agent = await loginAsAdmin();

    const res = agent.get("/orders/all")
    .send();

    expect(res.status).toStrictEqual(200);
    expectTypeOf(res.body).toBeArray();
    expect(res.body[0]).toMatchSchema(OrdersObject);
  });

  it("Returns 403 when not authenticated as admin", async () => {
    const res = request(app)
    .get("/orders/all")
    .send();

    expect(res.status).toStrictEqual(403);
  });
});

describe("GET /orders/:orderId", () => {
  it("Returns 200 with order info when successful", async () => {
    const agent = await loginAsAdmin();

    const res = agent.get("/orders/1")
    .send();

    expect(res.status).toStrictEqual(200);
  });

  it("Returns 403 when not authenticated as admin", async () => {
    const res = request(app)
    .get("/orders/1")
    .send();

    expect(res.status).toStrictEqual(403);
  });

  it("Returns 404 with invalid order ID", async () => {
    const agent = await loginAsAdmin();

    const res = agent.get("/orders/412805701955")
    .send();

    expect(res.status).toStrictEqual(404);
  });
});

describe("DELETE /orders/:orderId", () => {
  it("Returns 204 when successful", async () => {
    const agent = await loginAsAdmin();

    const res = agent.get("/orders/1")
    .send();

    expect(res.status).toStrictEqual(204);
  });

  it("Returns 403 when not authenticated as admin", async () => {
    const res = request(app)
    .delete("/orders/1")
    .send();

    expect(res.status).toStrictEqual(403);
  });

  it("Returns 404 with invalid order ID", async () => {
    const agent = await loginAsAdmin();

    const res = agent.get("/orders/4280428947")
    .send();

    expect(res.status).toStrictEqual(404);
  });
});
