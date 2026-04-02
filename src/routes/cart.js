import { Router } from "express";
import * as z from "zod";
import {
  getProductById,
  getCartItems,
  getItemInCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../db.js";
import { authorize } from "../middleware.js";

const cartRouter = Router();

/**
  A helper function that constructs a cart object with the given user ID.
*/
async function getUserCart(userId) {
  const cartItems = await getCartItems(userId);
  const totalPrice = cartItems.reduce(
    (acc, val) => acc += val.price * val.quantity,
    0
  );

  return {
    items: cartItems,
    price: totalPrice
  };
}

cartRouter.route("/cart")
.get(authorize("user"), async (req, res) => {
  res.status(200).json(await getUserCart(req.user.id));
})
.post(authorize("user"), async (req, res) => {
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity);
  if (quantity <= 0) {
    res.status(400).send("Invalid quantity given!");
    return;
  }

  const productToAdd = await getProductById(productId);
  if (productToAdd) {
    const cartItem = getItemInCart(req.user.id, productId);
    if (cartItem) {
      updateCartItem(req.user.id, productId, cartItem.quantity + quantity);
    } else {
      addCartItem(req.user.id, productId, quantity);
    }

    res.status(201).json(await getUserCart(req.user.id));
  } else {
    res.status(400).send("Invalid productId given!");
  }
})
.delete(authorize("user"), async (req, res) => {
  await clearCart(req.user.id);
  res.status(204).send();
});

async function checkItemInCart(req, res, next) {
  const productId = Number(req.params.productId);
  const cartItem = await getItemInCart(req.user.id, productId);
  if (cartItem) {
    req.cartItem = cartItem;
    next();
  } else {
    res.status(404).send("Product ID isn't in cart.");
  }
}

cartRouter.route("/cart/:productId")
.put(authorize("user"), checkItemInCart, async (req, res) => {
  const newQuantity = Math.floor(Number(req.body.quantity));
  if (newQuantity < 0) {
    res.status(400).send("Invalid quantity given.");
  } else if (newQuantity === 0) {
    removeCartItem(req.user.id, req.cartItem.productId);
    res.status(204).send();
  } else {
    updateCartItem(req.user.id, req.cartItem.productId, newQuantity);
    res.status(200).json({
      productId: req.cartItem.productId,
      productName: req.cartItem.name,
      quantity: newQuantity,
      price: req.cartItem.price
    });
  }
})
.delete(authorize("user"), checkItemInCart, async (req, res) => {
  await removeCartItem(req.user.id, req.cartItem.productId);
  res.status(204).send();
});

export default cartRouter;
