import { describe, it, expect, expectTypeOf } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import {
  login,
  loginAsAdmin
} from "./testutils.js";

const productObject = {
  name: expect.any(String),
  description: expect.any(String),
  price: expect.any(Number),
  stock: expect.any(Number),
  category: expect.any(String)
};

describe("GET /products", () => {
  it("Returns 200 with an array of product data", async () => {
    const res = await request(app)
    .get("/products")
    .send();

    expect(res.status).toStrictEqual(200);
    expectTypeOf(res.body).toBeArray();
    expect(res.body[0]).toMatchObject(productObject);
  });
});

describe("POST /products", () => {
  it("Returns 201 with product data when created successfully",
    async () => {
      const agent = await loginAsAdmin();

      const res = await agent.post("/products")
      .send({});

      expect(res.status).toStrictEqual(201);
      expect(res.body).toMatchObject(productObject);
    });

  it("Returns 400 when given invalid product data", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.post("/products")
    .send({});

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 403 when user isn't logged in as admin", async () => {
    const res = await request(app)
    .post("/products")
    .send({});

    expect(res.status).toStrictEqual(201);
  });
});

describe("GET /products/:productId", () => {
  it("Returns 200 with product data for valid productId", async () => {
    const res = await request(app)
    .get("/products/1")
    .send();

    expect(res.status).toStrictEqual(200);
    expect(res.body).toMatchObject(productObject);
  });

  it("Returns 404 for invalid productId", async () => {
    const res = await request(app)
    .get("/products/900001")
    .send();

    expect(res.status).toStrictEqual(404);
  });
});

describe("PUT /products/:productId", () => {
  it("Returns 200 with product data when successful", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/1")
    .send({});

    expect(res.status).toStrictEqual(200);
    expect(res.body).toMatchObject(productObject);
  });

  it("Returns 400 when given invalid product data", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/1")
    .send({});

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 403 when user isn't logged in as admin", async () => {
    const res = await request(app)
    .put("/products/1")
    .send({});

    expect(res.status).toStrictEqual(403);
  });

  it("Returns 404 for invalid productId", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/513451")
    .send({});

    expect(res.status).toStrictEqual(404);
  });
});

describe("DELETE /products/:productId", () => {
  it("Returns 204 with product data when successful", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.delete("/products/1")
    .send();

    expect(res.status).toStrictEqual(204);
  });

  it("Returns 403 when user isn't logged in as admin", async () => {
    const res = await request(app)
    .delete("/products/1")
    .send();

    expect(res.status).toStrictEqual(403);
  });

  it("Returns 404 for invalid productId", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/513451")
    .send();

    expect(res.status).toStrictEqual(404);
  });
});
