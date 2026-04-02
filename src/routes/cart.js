import { Router } from "express";
import * as z from "zod";
import {

} from "../db.js";
import { authorize } from "../middleware.js";

const cartRouter = Router();

cartRouter.route("/cart")
.get(authorize("user"), (req, res) => {
  res.status(501).send("Not implemented.");
})
.post(authorize("user"), (req, res) => {
  res.status(501).send("Not implemented.");
})
.delete(authorize("user"), (req, res) => {
  res.status(501).send("Not implemented.");
});

cartRouter.route("/cart/:productId")
.put(authorize("user"), (req, res) => {
  res.status(501).send("Not implemented.");
})
.delete(authorize("user"), (req, res) => {
  res.status(501).send("Not implemented.");
});

export default cartRouter;
