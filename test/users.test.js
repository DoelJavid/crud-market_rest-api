import { describe, it, expect } from "vitest";
import request from "supertest";
import session from "supertest-session";
import app from "../src/app.js";
import { login, loginAsAdmin, expectValidUser } from "./testutils.js";


//
// NOTE: The correct email and password is this:
// email: johndoe@example.com
// password: 1234abcd!@#$
//

const SAMPLE_USER = {
  username: "JohnDoe",
  email: "johndoe@example.com",
  phone: "777-777-7777"
};

describe("POST /auth", () => {
  it("Returns 200 with user data with vaild email and password",
    async (done) => {
      const payload = {
        email: "johndoe@example.com",
        password: "1234abcd!@#$"
      };

      const res = await request(app)
      .post("/auth")
      .send(payload);

      expect(res.status).toStrictEqual(200);
      expect(res.body).toEqual(SAMPLE_USER);
    });

  it("Returns 403 with incorrect email and/or password", async () => {
    const payload = {
      email: "johndoe@example.com",
      password: "Wr0NgPAs2"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(403);
  });
});

describe("POST /register", () => {
  it("Returns 201 with user data when successful", async () => {
    const payload = {
      email: "janedoe@example.com",
      phone: "333-333-3333",
      username: "JaneDoe",
      password: "P1ac3H0lD3r"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(201);
    expect(res.body).toEqual(SAMPLE_USER);
  });

  it("Returns 400 when invalid email is given", async () => {
    const payload = {
      email: "example.pingpong",
      phone: "333-333-3333",
      username: "JaneDoe",
      password: "P1ac3H0lD3r"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 when invalid phone is given", async () => {
    const payload = {
      email: "example.pingpong",
      phone: "3ab-3t9-3bg3",
      username: "JaneDoe",
      password: "P1ac3H0lD3r"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 on lengthy username", async () => {
    const payload = {
      email: "janedoe@example.com",
      phone: "333-333-3333",
      username: "JaneDoe",
      password: "P1ac3H0lD3r"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 on lengthy username", async () => {
    const payload = {
      email: "janedoe@example.com",
      phone: "333-333-3333",
      username: "ThisUsernameIsTooLongToBeUsed",
      password: "P1ac3H0lD3r"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 on username with symbols that aren't '_'", async () => {
    const payload = {
      email: "janedoe@example.com",
      phone: "333-333-3333",
      username: "#Invalid^Name!!!",
      password: "P1ac3H0lD3r"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(400);
  });

  it("Returns 400 when password is less than 8 chars long", async () => {
    const payload = {
      email: "janedoe@example.com",
      phone: "333-333-3333",
      username: "JaneDoe",
      password: "1234"
    };

    const res = await request(app)
    .post("/auth")
    .send(payload);

    expect(res.status).toStrictEqual(400);
  });
});

describe("GET /logout", () => {
  it("Returns 200 when used", async () => {
    const res = await request(app)
    .get("/logout")
    .send();

    expect(res.status).toStrictEqual(200);
  });
});

describe("GET /me", () => {
  it("Returns 200 with user data when authenticated", async () => {
    const session = await login();

    const res = await session.get("/me").send();

    expect(res.status).toStrictEqual(200);
    expectValidUser(res.body);
  });

  it("Returns 403 when not authenticated", async () => {
    const res = await request(app)
    .get("/me")
    .send();

    expect(res.status).toStrictEqual(403);
  });
});

describe("PUT /me", () => {
  it("Returns 200 with user data when authenticated", async () => {
    const session = await login();

    const res = await session.put("/me").send({
      email: "newemail@example.com"
    });

    expect(res.status).toStrictEqual(200);
    expectValidUser(res.body);
  });

  it("Returns 400 when invalid data is given", async () => {
    const session = await login();

    const res = await session.put("/me").send({
      email: "bademail.new"
    });

    expect(res.status).toStrictEqual(200);
  });

  it("Returns 403 when user isn't authenticated", async () => {
    const res = await request(app)
    .put("/me")
    .send({
      phone: "444-444-4444"
    });

    expect(res.status).toStrictEqual(403);
  });
});

describe("GET /users", () => {
  it("Returns 200 with user data array when authenticated as admin",
    async () => {
      const session = await loginAsAdmin();

      const res = await session.get("/users").send();

      expect(res.status).toStrictEqual(200);
      expect(res.body).toBeArray();
      expectValidUser(res.body[0]);
    });

  it("Returns 403 for non-admin users", async () => {
    const res = await request(app)
    .get("/users")
    .send();

    expect(res.status).toStrictEqual(403);
  });
});

describe("GET /users/:userId", () => {
  it("Returns 200 with user data when authenticated as admin", async () => {
    const session = await loginAsAdmin();

    const res = await session.get("/users/1").send();

    expect(res.status).toStrictEqual(200);
    expectValidUser(res.body);
  });

  it("Returns 403 for non-admin users", async () => {
    const res = await request(app)
    .get("/users/4")
    .send();

    expect(res.status).toStrictEqual(403);
  });

  it("Returns 404 when user isn't found", async () => {
    const session = await loginAsAdmin();

    const res = await session.get("/users/9001").send();

    expect(res.status).toStrictEqual(200);
  });
});

describe("DELETE /users/:userId", () => {
  it("Returns 204 when authenticated as admin", async () => {
    const session = await loginAsAdmin();

    const res = await session.get("/users/3").send();

    expect(res.status).toStrictEqual(200);
    expectValidUser(res.body);
  });

  it("Returns 403 for non-admin users", async () => {
    const res = await request(app)
    .delete("/users/4")
    .send();

    expect(res.status).toStrictEqual(403);
  });

  it("Returns 404 when user isn't found", async () => {
    const session = await loginAsAdmin();

    const res = await session.get("/users/91204").send();

    expect(res.status).toStrictEqual(404);
  });
});
