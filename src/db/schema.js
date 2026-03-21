import { pgTable, pgEnum, primaryKey } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "admin", "owner"])

export const users = pgTable("users", (t) => ({
  id: t.serial().primaryKey(),
  username: t.varchar().notNull().unique(),
  email: t.varchar().notNull().unique(),
  phone: t.varchar(),
  address: t.varchar().notNull(),
  role: rolesEnum().default("user")
}));

export const categories = pgTable("categories", (t) => ({
  id: t.serial().primaryKey(),
  name: t.varchar().notNull().unique()
}));

export const products = pgTable("products", (t) => ({
  id: t.serial().primaryKey(),
  name: t.varchar().notNull().unique(),
  description: t.text(),
  price: t.doublePrecision().notNull(),
  stock: t.integer().notNull(),
  categoryId: t.integer().references(() => categories.id)
}));

export const cartItems = pgTable("cart_items", (t) => {
  const table = {
    userId: t.integer().references(() => users.id),
    productId: t.integer().references(() => products.id),
    productCount: t.integer().default(1)
  };
  primaryKey({ columns: [table.userId, table.productId] });
  return table;
});

export const orders = pgTable("orders", (t) => ({
  id: t.serial().primaryKey(),
  userId: t.integer().references(() => users.id),
  deliveryAddress: t.varchar()
}));

export const ordersItems = pgTable("orders_items", (t) => {
  const table = {
    orderId: t.integer().references(() => orders.id),
    productId: t.integer().references(() => products.id),
    productCount: t.integer().default(1)
  };
  primaryKey({ columns: [table.orderId, table.productId] });
  return table;
});
