import "dotenv/config";
import bcrypt from "bcrypt";
import { eq, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  users,
  products,
  categories,
  cartItems,
  orders,
  ordersItems
} from "./db/schema.js";

const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case"
});

//
// Please note that these functions only handle database operations. They don't
// handle anything else besides that. Please handle things like password
// hashing and validation outside of this file.
//

///////////////////////////////////////////////////////////////////////////////
// User Queries
///////////////////////////////////////////////////////////////////////////////

/**
  @typedef {Object} User
  @property {number} id
  @property {string} email
  @property {string} phone
  @property {string} username
*/

/**
  Registers a new user with the given information.

  @param {string} username
  @param {string} passwordHash
  @param {string} email
  @param {string} phone
*/
export async function registerUser(username, passwordHash, email, phone) {
  await db.insert(users)
  .values({
    username,
    password: passwordHash,
    email,
    phone
  });
}

/**
  Attempts to obtain a user with the given email and password hash.

  @param {string} email
  @param {string} password
  @return {User?}
*/
export async function authenticateUser(email, password) {
  const result = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      password: users.password,
      phone: users.phone
    })
  .from(users)
  .where(eq(users.email, email));

  const passwordMatches = await bcrypt.compare(password, result.password);
  if (passwordMatches) {
    return {
      id: result.id,
      username: result.username,
      email: result.email,
      phone: result.phone
    };
  }

  return null;
}

/**
  Attempts to update the given user with the given data.

  @param {number} userId
  @param {User?} newData
*/
export async function updateUser(userId, newData) {
  if (newData) {
    await db.update(users)
    .set({
      ...(newData.username ? { username: newData.username } : {}),
      ...(newData.password ? { username: newData.password } : {}),
      ...(newData.email ? { username: newData.email } : {}),
      ...(newData.phone ? { username: newData.phone } : {})
    })
    .where(eq(users.id, userId));
  }
}

/**
  Attempts to delete the user with the given userId.

  @param {number} userId
  @return {User?}
*/
export async function deleteUser(userId) {
  return await db.delete(users)
  .where(eq(users.id, userId));
}

/**
  Returns a new user object from the database using the given userId.

  @param {number} userId
  @return {User?}
*/
export async function getUserById(userId) {
  return await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      phone: users.phone
    })
  .from(users)
  .where(eq(users.id, userId));
}

/**
  Attempts to obtain the owner of the application.

  @return {User?}
*/
export async function getOwner() {
  return await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      phone: users.phone
    })
  .from(users)
  .where(eq(users.role, "owner"))[0];
}

/**
  Returns a list of users that match a given query.

  @param {{
    q: string;
    limit: number;
    page: number;
  }?} queryData
  @return {Array<User>}
*/
export async function getUsers(queryData) {
  const { q = "", limit = 50, page = 0 } = queryData;
  const result = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      phone: users.phone
    })
  .from(users)
  .limit(Number(limit))
  .offset(Number(limit) * Number(page));

  return result || [];
}

/**
  Returns the priveleges of the user with the given userId.

  @param {number} userId
  @return {string?}
*/
export async function getUserPriveleges(userId) {
  const result = await db.select({
      role: users.role
    })
  .from(users)
  .where(eq(users.id, userId));
  return result;
}

///////////////////////////////////////////////////////////////////////////////
// Product Queries
///////////////////////////////////////////////////////////////////////////////

/**
  Lists all the current categories with their respective categoryIds.

  @return {{
    id: number;
    name: string;
  }}
*/
export async function getCategories() {
  return await db.select({
      id: categories.id,
      name: categories.name
    })
  .from(categories);
}

/**
  Adds the category with the given name.

  @param {string} name
*/
export async function addCategory(name) {
  await db.insert(categories)
  .values({ name });
}

/**
  Removes the category with the given name.

  @param {string} name
*/
export async function removeCategory(name) {
  await db.delete(categories)
  .where(eq(categories.name, name));
}

/**
  Renames the category with the given name.

  @param {string} oldName
  @param {string} newName
*/
export async function renameCategory(oldName, newName) {
  await db.update(categories)
  .set({ name: newName })
  .where(eq(categories.name, oldName));
}



/**
  @typedef {Object} Product
  @property {number} id
  @property {string} name
  @property {string} description
  @property {number} price
  @property {number} stock
  @property {string} category
*/

/**
  Returns a list of products that match a given query.

  @param {{
    q: string;
    limit: number;
    page: number;
  }?} queryData
  @return {Array<Product>}
*/
export async function getProducts(queryData) {
  const result = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      stock: products.stock,
      category: categories.name
    })
  .from(products)
  .innerJoin(categories, eq(products.categoryId, categories.id));
}

/**
  Returns the product with the given productId.

  @param {number} productId
  @return {Product}
*/
export async function getProductById(productId) {
  const result = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      stock: products.stock,
      category: categories.name
    })
  .from(products)
  .innerJoin(categories, eq(products.categoryId, categories.id))
  .where(eq(products.id, productId));
}

/**
  Attempts to create a product with the given product data.

  @param {Object} productData
*/
export async function createProduct(productData) {
  let categoryId = null;
  if (productData.category) {
    categoryId = await db.select({
        name: categories.name
      })
    .from(categories)
    .where(eq(categories.name, productData.category));
  }

  await db.insert(products)
  .values({
    name: productData.name,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    categoryId: categoryId || productData.categoryId
  });
}

/**
  Attempts to update the product with the given productId.

  @param {number} productId
  @param {Object} productData
*/
export async function updateProduct(productId, productData) {
  let categoryId = null;
  if (productData.category) {
    categoryId = await db.select({
        name: categories.name
      })
    .from(categories)
    .where(eq(categories.name, productData.category));
  }

  await db.update(products)
  .set({
    ...(productData.name ? { name: productData.name } : {}),
    ...(
      productData.description
      ? { description: productData.description }
      : {}
    ),
    ...(productData.price ? { price: productData.price } : {}),
    ...(productData.stock ? { stock: productData.stock } : {}),
    ...(categoryId ? { categoryId } : {})
  })
  .where(eq(products.id, productId));
}

/**
  Deletes the product with the given productId.

  @param {number} productId
*/
export async function deleteProduct(productId) {
  await db.delete(products)
  .where(eq(products.id, productId));
}

///////////////////////////////////////////////////////////////////////////////
// Cart Queries
///////////////////////////////////////////////////////////////////////////////

/**
  @typedef {Object} CartItem
  @property {string} productName
  @property {number} quantity
  @property {number} price
*/

/**
  Obtains all products in the user's cart.

  @return {Array<CartItem>}
*/
export async function getCartItems(userId) {
  await db.select({
      productName: products.name,
      quantity: cartItems.productCount,
      price: products.price
    })
  .from(cartItems)
  .innerJoin(products, eq(cartItems.productId, products.id))
  .where(eq(cartItems.userId, userId));
}

/**
  Returns a product within the user's cart or null if the item isn't in the
  user's cart.

  @return {Product?}
*/
export async function getItemInCart(userId, productId) {
  const result = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      stock: products.stock,
      category: categories.name
    })
  .from(cartItems)
  .innerJoin(products, eq(cartItems.productId, products.id))
  .innerJoin(categories, eq(products.categoryId, categories.id))
  .where(
    and(eq(cartItems.userId, userId), eq(products.id, productId))
  );
}

/**
  Adds the amount of product of the given productId to the user's cart.

  @param {number} userId
  @param {number} productId
  @param {number} amount
*/
export async function addCartItem(userId, productId, amount) {
  await db.insert(cartItems)
  .values({
    userId,
    productId,
    productCount: amount
  });
}

/**
  Updates the quantity of the product within the user's cart.

  @param {number} userId
  @param {number} productId
  @param {number} amount
*/
export async function updateCartItem(userId, productId, amount) {
  await db.update(cartItems)
  .set({ productCount: amount })
  .where(
    and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
  );
}

/**
  Deletes the item with the given productId from the user's cart.

  @param {number} userId
  @param {number} productId
*/
export async function removeCartItem(userId, productId) {
  await db.delete(cartItems)
  .where(
    and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
  );
}

/**
  Clears the given user's cart.

  @param {number} userId
*/
export async function clearCart(userId) {
  await db.delete(cartItems)
  .where(eq(cartItems.userId, userId));
}

///////////////////////////////////////////////////////////////////////////////
// Order Queries
///////////////////////////////////////////////////////////////////////////////

/**
  @typedef {Object} OrderItem
  @property {number} productId
  @property {string} productName
  @property {number} quantity
*/

/**
  @typedef {Object} Order
  @property {string} id
  @param {Object} deliveryAddress
  @param {string} deliveryCity
  @param {string} deliveryState
  @property {Array<OrderItem>} items
*/

/**
  Gets all orders with the given query data.

  @param {Object} queryData
  @param {string} queryData.q
  @param {number} queryData.limit
  @param {number} queryData.page
  @return {Array<Order>}
*/
export async function getOrders(queryData) {
  // This has probably got to be the most complicated database query I ever had
  // to implement in this entire project.

  const { q = "", limit = 50, page = 0 } = queryData;
  const orderList = await db.select({
      id: orders.id,
      userId: orders.userId,
      deliveryAddress: orders.deliveryAddress,
      deliveryCity: orders.deliveryCity,
      deliveryState: orders.deliveryState
    })
  .from(orders)
  .limit(Number(limit))
  .offset(Number(limit) * Number(page));

  const selectedOrderIds = orderList.map((order) => order.id);
  const listedItems = await db.select({
      orderId: ordersItems.orderId,
      productId: ordersItems.productId,
      productName: products.name,
      quantity: ordersItems.productCount
    })
  .from(ordersItems)
  .innerJoin(products, eq(ordersItems.productId, products.id))
  .where(inArray(ordersItems.productId, selectedOrderIds));

  return orderList.map((order) => ({
    ...order,
    items: listedItems.filter((item) => item.orderId === order.id)
    .map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity
    }))
  }));
}

/**
  Retrieves a list of orders accociated with the given userId.

  @param {number} orderId
  @return {Order}
*/
export async function getOrdersByUserId(userId, queryData) {
  const { q = "", limit = 50, page = 0 } = queryData;
  const orderList = await db.select({
      id: orders.id,
      userId: orders.userId,
      deliveryAddress: orders.deliveryAddress,
      deliveryCity: orders.deliveryCity,
      deliveryState: orders.deliveryState
    })
  .from(orders)
  .where(eq(orders.userId, userId))
  .limit(Number(limit))
  .offset(Number(limit) * Number(page));

  const selectedOrderIds = orderList.map((order) => order.id);
  const listedItems = await db.select({
      orderId: ordersItems.orderId,
      productId: ordersItems.productId,
      productName: products.name,
      quantity: ordersItems.productCount
    })
  .from(ordersItems)
  .innerJoin(products, eq(ordersItems.productId, products.id))
  .where(inArray(ordersItems.productId, selectedOrderIds));

  return orderList.map((order) => ({
    ...order,
    items: listedItems.filter((item) => item.orderId === order.id)
    .map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity
    }))
  }));
}

/**
  Gets the order with the given orderId.

  @param {number} orderId
  @return {Order}
*/
export async function getOrderById(orderId) {
  const order = await db.select({
      id: orders.id,
      userId: orders.userId,
      deliveryAddress: orders.deliveryAddress,
      deliveryCity: orders.deliveryCity,
      deliveryState: orders.deliveryState
    })
  .from(orders)
  .where(eq(orders.id, orderId))
  .limit(1);

  const orderItems = await db.select({
      productId: ordersItems.productId,
      productName: products.name,
      quantity: ordersItems.productCount
    })
  .from(ordersItems)
  .where(eq(ordersItems.orderId, orderId));

  return {
    ...order,
    items: orderItems
  };
}

/**
  Creates a new order with the given item IDs.

  @param {number} userId,
  @param {Object} shippingAddress
  @param {string} shippingAddress.city
  @param {string} shippingAddress.state
  @param {string} shippingAddress.address
  @param {string} zip
  @param {Array<Object>} items
  @param {number} items.productId
  @param {number} items.quantity
*/
export async function createOrder(userId, shippingAddress, itemIds) {
  const newOrderId = await db.insert(orders)
  .values({
    userId,
    deliveryAddress: shippingAddress.address,
    deliveryCity: shippingAddress.city,
    deliveryState: shippingAddress.state,
  })
  .returning({
    id: orders.id
  });

  await db.insert(ordersItems)
  .values(itemIds.map((item) => ({
    orderId: newOrderId,
    productId: item.productId,
    productCount: item.quantity
  })));
}

export async function deleteOrder(orderId) {
  await db.delete(ordersItems)
  .where(eq(ordersItems.orderId, orderId));

  await db.delete(orders)
  .where(eq(orders.id, orderId));
}
