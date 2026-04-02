import { describe, it, beforeAll, expect, expectTypeOf } from "vitest";
import * as z from "zod";
import request from "supertest";
import { login } from "./testutils.js";
import app from "../src/app.js";

const CartItem = z.strictObject({
  productName: z.string(),
  quantity: z.number().positive().int(),
  price: z.number().positive()
});

const Cart = z.strictObject({
  items: z.array(CartItem),
  price: z.number().positive()
});

describe("GET /cart", () => {
  it("Returns 200 with the cart if successful", async () => {
    const agent = await login();

    const res = await agent.get("/cart")
    .send();

    expect(res.status).toStrictEqual(200);
    expect(res.body).toMatchSchema(Cart);
  });

  it("Returns 403 if not logged in", async () => {
    const res = await request(app)
    .get("/cart")
    .send();

    expect(res.status).toStrictEqual(403);
  });
});

describe("POST /cart", () => {
  it("Returns 201 with the cart item if successful", async () => {
    const agent = await login();

    const res = await agent.post("/cart")
    .send({ productId: 2, quantity: 1 });

    expect(res.status).toStrictEqual(201);
    expect(res.body).toMatchSchema(Cart);
  });

  it("Returns 400 if invalid product ID was given", async () => {
    const agent = await login();

    const res = await agent.post("/cart")
    .send({ productId: 20002, quantity: 1 });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 403 if not logged in", async () => {
    const res = await request(app)
    .post("/cart")
    .send({ productId: 2, quantity: 1 });

    expect(res.status).toStrictEqual(403);
  });
});

describe("DELETE /cart", () => {
  it("Returns 204 in all normal circumstances", async () => {
    const agent = await login();

    const res = await agent.delete("/cart")
    .send();

    expect(res.status).toStrictEqual(204);
  });

  it("Returns 403 if not logged in", async () => {
    const res = await request(app)
    .delete("/cart")
    .send();

    expect(res.status).toStrictEqual(403);
  });
});

describe("PUT /cart/:productId", () => {
  it("Returns 200 with the cart item if successful", async () => {
    const agent = await login();

    const res = await agent.put("/cart/1")
    .send({ quantity: 2 });

    expect(res.status).toStrictEqual(200);
    expect(res.body).toMatchSchema(CartItem);
  });

  it("Returns 204 with the cart item if quantity is zero", async () => {
    const agent = await login();

    const res = await agent.put("/cart/1")
    .send({ quantity: 0 });

    expect(res.status).toStrictEqual(204);
  });

  it("Returns 400 if invalid product ID was given", async () => {
    const agent = await login();

    const res = await agent.put("/cart/100001")
    .send({ quantity: 3 });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 if invalid quantity was given", async () => {
    const agent = await login();

    const res = await agent.put("/cart")
    .send({ quantity: -51 });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 403 if not logged in", async () => {
    const res = await request(app)
    .put("/cart")
    .send({ quantity: 2 });

    expect(res.status).toStrictEqual(403);
  });
});

describe("DELETE /cart/:productId", () => {
  it("Returns 204 if successful", async () => {
    const agent = await login();

    const res = await agent.delete("/cart/1")
    .send();

    expect(res.status).toStrictEqual(204);
  });

  it("Returns 403 if not logged in", async () => {
    const res = await request(app)
    .delete("/cart/1")
    .send();

    expect(res.status).toStrictEqual(403);
  });

  it(
    "Returns 404 if item's not in cart or for bad product IDs",
    async () => {
      const agent = await login();

      const res = await agent.delete("/cart/124098701829")
      .send();

      expect(res.status).toStrictEqual(404);
    }
  );
});
