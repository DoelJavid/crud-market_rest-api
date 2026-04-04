import { Router } from "express";
import * as z from "zod";
import {
  getOrders,
  getOrdersByUserId,
  getOrderById,
  deleteOrder
} from "../db.js";
import { authorize } from "../middleware.js";

const ordersRouter = Router();

ordersRouter.get("/orders", authorize("user"), async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id, req.body);
  res.status(200).json(orders);
});

ordersRouter.get("/orders/all", authorize("admin"), async (req, res) => {
  const orders = await getOrders(req.body);
  res.status(200).json(orders);
});

ordersRouter.route("/orders/:orderId")
.get(authorize("admin"), async (req, res) => {
  const orderId = Number(req.params.orderId);
  const orderData = await getOrderById(orderId);
  if (orderData) {
    res.status(200).json(orderData);
  } else {
    res.status(404).send("Order not found!");
  }
})
.delete(authorize("admin"), async (req, res) => {
  const orderId = Number(req.params.orderId);
  const orderData = await getOrderById(orderId);
  if (orderData) {
    await deleteOrder(orderId);
    res.status(204).send();
  } else {
    res.status(404).send("Order not found!");
  }
});

export default ordersRouter;
