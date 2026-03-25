import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("app", () => {
  it("GET '/' returns 'Hello world!'", async () => {
    const res = await request(app).get("/").send();
    expect(res.text).toStrictEqual("Hello world!");
  });
});
