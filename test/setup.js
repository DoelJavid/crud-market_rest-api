import { vi, expect, beforeAll } from "vitest";
import * as z from "zod";
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

const sampleCartItems = [{
    userId: 3,
    productId: 1,
    quantity: 1
  },
  {
    userId: 3,
    productId: 2,
    quantity: 1
  },
  {
    userId: 3,
    productId: 3,
    quantity: 2
  }
];

const sampleOrders = [{
    id: 1,
    items: [],
    deliverTo: {
      city: "Springfield",
      state: "Ohio",
      address: "5454 Example Dr.",
      zip: "99991"
    }
  },
  {
    id: 2,
    items: [],
    deliverTo: {
      city: "Springfield",
      state: "Ohio",
      address: "5454 Example Dr.",
      zip: "99991"
    }
  },
  {
    id: 3,
    items: [],
    deliverTo: {
      city: "Springfield",
      state: "Ohio",
      address: "5454 Example Dr.",
      zip: "99991"
    }
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

  createProduct: vi.fn(async () => {}),

  updateProduct: vi.fn(async () => {}),

  deleteProduct: vi.fn(async () => {}),

  // Cart Queries

  getCartItems: vi.fn(
    async (userId) => sampleCartItems
    .filter((item) => item.userId === userId)
    .map((item) => {
      const product = sampleProducts.find(
        (p) => p.id === item.productId
      );
      if (product) {
        return {
          productName: product.name,
          quantity: item.quantity,
          price: product.price
        };
      }
    })
  ),

  getItemInCart: vi.fn(async (userId, productId) => {
    const cartItem = sampleCartItems.find(
      (item) =>
      item.userId === userId && item.productId === productId
    );
    const product = sampleProducts.find(
      (item) => item.id === productId
    );
    if (cartItem && product) {
      return product;
    }
    return null;
  }),

  addCartItem: vi.fn(async () => {}),

  updateCartItem: vi.fn(async () => {}),

  removeCartItem: vi.fn(async () => {}),

  clearCart: vi.fn(async () => {}),

  // Order Queries

  getOrders: vi.fn(async () => sampleOrders),

  getOrderById: vi.fn(async (orderId) => sampleOrders.find(
    (order) => order.id === orderId)),

  getOrdersByUserId: vi.fn(async () => sampleOrders),

  createOrder: vi.fn(async () => {}),

  deleteOrder: vi.fn(async () => {})
}));

beforeAll(() => {
  expect.extend({
    toMatchSchema: (recieved, expected) => {
      try {
        expected.parse(recieved);
      } catch (err) {
        return {
          message: () =>
            `expected value to match schema\n${z.prettifyError(err)}`,
          pass: false
        };
      }
      return {
        message: () => "value matches schema",
        pass: true
      };
    }
  });
});
