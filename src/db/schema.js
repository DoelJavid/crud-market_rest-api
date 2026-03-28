import { pgTable, pgEnum, primaryKey } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "admin", "owner"])

export const users = pgTable("users", (t) => ({
  id: t.serial().primaryKey(),
  username: t.varchar({ length: 32 }).notNull().unique(),
  password: t.varchar({ length: 200 }).notNull(),
  email: t.varchar({ length: 254 }).notNull().unique(),
  phone: t.varchar({ length: 12 }),
  role: rolesEnum().default("user")
}));

export const categories = pgTable("categories", (t) => ({
  id: t.serial().primaryKey(),
  name: t.varchar({ length: 32 }).notNull().unique()
}));

export const products = pgTable("products", (t) => ({
  id: t.serial().primaryKey(),
  name: t.varchar({ length: 50 }).notNull().unique(),
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
  deliveryAddress: t.varchar({ length: 50 }),
  deliveryCity: t.varchar({ length: 50 }),
  deliveryState: t.varchar({ length: 30 })
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
