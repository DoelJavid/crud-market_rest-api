import { vi } from "vitest";
import {
  sampleAdmin,
  sampleUser,
  sampleAdminWithPassword,
  sampleUserWithPassword
} from "./testutils.js";

const sampleUsers = [{
    id: 1,
    email: "djavid@example.com",
    phone: "555-555-5555",
    username: "DoelJavid",
    password: "sUpRDupRS3cUr3OWNERPasS",
    role: "owner"
  },
  {
    id: 2,
    email: "johndoe@example.com",
    phone: "777-777-7777",
    username: "JohnDoe",
    password: "sUpRDupRS3cUr3Ad31nPasS",
    role: "admin"
  },
  {
    id: 3,
    email: "janedoe@example.com",
    phone: "555-555-5555",
    username: "JaneDoe",
    password: "1234abcd!@#$",
    role: "admin"
  }
];

const sampleCategories = [
  { id: 1, name: "Yard Tools" },
  { id: 2, name: "Appliances" },
  { id: 3, name: "Home Improvement" },
];

const sampleProducts = [{
    id: 1,
    name: "Weed Eater",
    description: "Lorem ipsum dolor sit amet.",
    price: 15.99,
    stock: 55,
    categoryId: 1
  },
  {
    id: 2,
    name: "Soda Carbonator",
    description: "Lorem ipsum dolor sit amet.",
    price: 17.94,
    stock: 55,
    categoryId: 2
  },
  {
    id: 3,
    name: "Sandwich Maker",
    description: "Lorem ipsum dolor sit amet.",
    price: 18.99,
    stock: 55,
    categoryId: 2
  }
];

vi.mock("../src/db.js", () => ({
  // User Queries
  registerUser: vi.fn(async (username, password, email, phone) => ({
    id: 4,
    username,
    email,
    phone
  })),

  updateUser: vi.fn(async (userId, newData) => {}),

  deleteUser: vi.fn(async (userId, newData) => {}),

  authenticateUser: vi.fn(async (email, password) => {
    const user = sampleUsers.find(
      (user) => user.email === email && user.password === password
    );

    // Note: Probably shouldn't export the password or role.
    return user
      ? {
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: user.username
      }
      : null;
  }),

  getUserById: vi.fn(async (userId) => {
    // NOTE: PSQL is one-indexed, while JavaScript is zero-indexed.
    return sampleUsers[userId - 1];
  }),

  getUsers: vi.fn(async () => sampleUsers),

  getUserPriveleges: vi.fn(async (userId) => {
    const user = sampleUsers.find((user) => user.id === userId);
    if (user) {
      return user.role;
    }
    return null;
  }),

  // Product Queries

  getCategories: vi.fn(async () => sampleCategories),

  addCategory: vi.fn(async () => {}),

  removeCategory: vi.fn(async () => {}),

  renameCategory: vi.fn(async () => {}),

  getProducts: vi.fn(async () => sampleProducts.map((product) => {
    const category = sampleCategories.find(
      (category) => category.id === product.categoryId
    );

    if (category) {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: category.name
      }
    }
    return null;
  })),

  getProductById: vi.fn(async (productId) => {
    const product = sampleProducts.find((product) => product.id ===
      productId);
    if (product) {
      const category = sampleCategories.find(
        (category) => category.id === product.categoryId
      );

      if (category) {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: category.name
        }
      }
    }
    return null;
  }),

  addProduct: vi.fn(async () => {}),

  updateProduct: vi.fn(async () => {}),

  deleteProduct: vi.fn(async () => {})
}));
