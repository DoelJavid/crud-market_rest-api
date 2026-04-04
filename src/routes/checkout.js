import { Router } from "express";
import * as z from "zod";
import {

} from "../db.js";
import { authorize } from "../middleware.js";

const checkoutRouter = Router();

checkoutRouter.post("/checkout", authorize("user"), (req, res) => {
  res.status(501).send("Not implemented!");
})

export default checkoutRouter;
