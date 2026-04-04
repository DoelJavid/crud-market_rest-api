import { Router } from "express";
import * as z from "zod";
import {

} from "../db.js";
import { authorize } from "../middleware.js";

const ordersRouter = Router();

ordersRouter.get("/orders", authorize("user"), (req, res) => {
  res.status(501).send("Not implemented!");
});

ordersRouter.get("/orders/all", authorize("admin"), (req, res) => {
  res.status(501).send("Not implemented!");
});

ordersRouter.route("/orders/:orderId")
.get(authorize("admin"), (req, res) => {
  res.status(501).send("Not implemented!");
})
.delete(authorize("admin"), (req, res) => {
  res.status(501).send("Not implemented!");
});

export default ordersRouter;
