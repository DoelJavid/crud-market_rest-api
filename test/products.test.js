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
  it(
    "Returns 201 with product data when created successfully",
    async () => {
      const agent = await loginAsAdmin();

      const res = await agent.post("/products")
      .send({
        name: "Fox Book",
        description: "The quick brown fox jumped over the lazy dog.",
        price: 4.99,
        stock: 15,
        category: "Books"
      });

      expect(res.status).toStrictEqual(201);
      expect(res.body).toMatchObject(productObject);
    }
  );

  it("Returns 400 when missing product data", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.post("/products")
    .send({
      name: "Fox Book",
      description: "The quick brown fox jumped over the lazy dog.",
      category: "Books"
    });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 when given long product name", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.post("/products")
    .send({
      name: "Really Really Really Super Duper Ultra Long Fox Book",
      description: "The quick brown fox jumped over the lazy dog.",
      price: 4.99,
      stock: 15,
      category: "Books"
    });

    expect(res.status).toStrictEqual(400);
  });

  it(
    "Returns 400 when name has numbers or special characters",
    async () => {
      const agent = await loginAsAdmin();

      const res = await agent.post("/products")
      .send({
        name: "15*Crazy.Stars",
        description: "Yes...",
        price: 109.99,
        stock: 9000,
        category: "Utilities"
      });

      expect(res.status).toStrictEqual(400);
    }
  );

  it("Returns 400 when given decimal as stock", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.post("/products")
    .send({
      name: "Fox Book",
      description: "The quick brown fox jumped over the lazy dog.",
      price: 4.99,
      stock: 3.14159,
      category: "Books"
    });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 when category is too long", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.post("/products")
    .send({
      name: "Fox Book",
      description: "The quick brown fox jumped over the lazy dog.",
      price: 4.99,
      stock: 3,
      category: "WayTooSuperDuperUltraSillyLongCategory"
    });

    expect(res.status).toStrictEqual(400);
  });

  it(
    "Returns 400 when category has numbers, whitespace, or special characters",
    async () => {
      const agent = await loginAsAdmin();

      const res = await agent.post("/products")
      .send({
        name: "Really Really Really Super Duper Ultra Long Fox Book",
        description: "The quick brown fox jumped over the lazy dog.",
        price: 4.99,
        stock: 5,
        category: "f31 2.*3"
      });

      expect(res.status).toStrictEqual(400);
    }
  );

  it("Returns 403 when user isn't logged in as admin", async () => {
    const res = await request(app)
    .post("/products")
    .send({
      name: "Fox Book",
      description: "The quick brown fox jumped over the lazy dog.",
      price: 4.99,
      stock: 15,
      category: "Books"
    });

    expect(res.status).toStrictEqual(403);
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
    .send({
      name: "Delta Alpha"
    });

    expect(res.status).toStrictEqual(200);
    expect(res.body).toMatchObject(productObject);
  });

  it("Returns 400 when given long product name", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/1")
    .send({
      name: "Really Really Really Super Duper Ultra Long Fox Book"
    });

    expect(res.status).toStrictEqual(400);
  });

  it(
    "Returns 400 when name has numbers or special characters",
    async () => {
      const agent = await loginAsAdmin();

      const res = await agent.put("/products/1")
      .send({
        name: "15*Crazy.Stars"
      });

      expect(res.status).toStrictEqual(400);
    }
  );

  it("Returns 400 when given decimal as stock", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/1")
    .send({
      stock: 3.14159
    });

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 when category is too long", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/1")
    .send({
      category: "WayTooSuperDuperUltraSillyLongCategory"
    });

    expect(res.status).toStrictEqual(400);
  });

  it(
    "Returns 400 when category has numbers, whitespace, or special characters",
    async () => {
      const agent = await loginAsAdmin();

      const res = await agent.put("/products/1")
      .send({
        category: "f31 2.*3"
      });

      expect(res.status).toStrictEqual(400);
    }
  );

  it("Returns 403 when user isn't logged in as admin", async () => {
    const res = await request(app)
    .put("/products/1")
    .send({});

    expect(res.status).toStrictEqual(403);
  });

  it("Returns 404 for invalid productId", async () => {
    const agent = await loginAsAdmin();

    const res = await agent.put("/products/513451")
    .send({
      name: "Foxtrot"
    });

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

    const res = await agent.delete("/products/513451")
    .send();

    expect(res.status).toStrictEqual(404);
  });
});
