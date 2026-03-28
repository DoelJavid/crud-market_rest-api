ALTER TABLE "categories" ALTER COLUMN "name" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "delivery_address" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(254);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET DATA TYPE varchar(12);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivery_city" varchar(50);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivery_state" varchar(30);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "address";