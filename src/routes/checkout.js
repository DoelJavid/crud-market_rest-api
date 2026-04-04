import { Router } from "express";
import * as z from "zod";
import cardValidate from "card-validator";
import {
  getCartItems,
  clearCart,
  createOrder
} from "../db.js";
import { authorize } from "../middleware.js";

const checkoutRouter = Router();

const OrderAddress = z.object({
  city: z.string().trim().regex(/[a-z]+/i),
  state: z.string().trim().regex(/[a-z]+/i),
  address: z.string().trim().regex(/[0-9]{4} [a-z]+ [a-z]+\.?/i),
  zip: z.string().trim().regex(/[0-9]{5}/)
});

const OrderInfo = z.object({
  cardNumber: z.string()
  .trim()
  .refine((val) => cardValidate.number(val).isValid),
  cvv: z.string()
  .trim()
  .refine((val) => cardValidate.cvv(val).isValid),
  expiryDate: z.string()
  .trim()
  .refine((val) => cardValidate.expirationDate(val).isValid),
  cardSignature: z.string()
  .trim()
  .regex(/[a-z]+( [a-z]+\.?)*/i),
  billingAddress: OrderAddress,
  shippingAddress: z.optional(OrderAddress)
});

checkoutRouter.post("/checkout", authorize("user"), async (req, res) => {
  try {
    const orderInfo = OrderInfo.parse(req.body);
    const cartItems = await getCartItems(req.user.id);

    // Now, you would implement payment processing here, but I'm not gonna do
    // it. Remember, this is supposed to be completely fake.

    await createOrder(
      req.user.id,
      orderInfo.shippingAddress || orderInfo.billingAddress,
      cartItems
    );

    res.status(201).send("Order created successfully!");
  } catch (err) {
    res.status(400).send("Invalid data given!");
    return;
  }
})

export default checkoutRouter;
