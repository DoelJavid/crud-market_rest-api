import { vi } from "vitest";
import {
  sampleAdmin,
  sampleUser,
  sampleAdminWithPassword,
  sampleUserWithPassword
} from "./testutils.js";

vi.mock("../src/db.js", () => ({
  registerUser: vi.fn(async (username, password, email, phone) => ({
    id: 3,
    username,
    email,
    phone
  })),

  updateUser: vi.fn(async (userId, newData) => {}),

  deleteUser: vi.fn(async (userId, newData) => {}),

  authenticateUser: vi.fn(async (email, password) => {
    if (
      email === sampleUserWithPassword.email &&
      password === sampleUserWithPassword.password
    ) {
      return sampleUser;
    } else if (
      email === sampleAdminWithPassword.email &&
      password === sampleAdminWithPassword.password
    ) {
      return sampleAdmin;
    }
    return null;
  }),

  getUserById: vi.fn(async (userId) => {
    switch (userId) {
      case 1:
        return sampleAdmin;
      case 2:
        return sampleUser;
      default:
        return null;
    }
  }),

  getUsers: vi.fn(async () => [
    sampleAdmin,
    sampleUser,
    {
      id: 2,
      username: "JaneDoe",
      email: "janedoe@example.com",
      phone: "333-333-3333"
    }
  ]),

  getUserPriveleges: vi.fn(async (userId) => {
    if (userId === 1) {
      return "admin";
    }
    return "user";
  })
}));
