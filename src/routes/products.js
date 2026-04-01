import { Router } from "express";

const productsRouter = Router();

productsRouter.route("/products")
.get((req, res) => {
  res.status(501).send("Not implemented.");
})
.post((req, res) => {
  res.status(501).send("Not implemented.");
});

productsRouter.route("/products/:productId")
.get((req, res) => {
  res.status(501).send("Not implemented.");
})
.put((req, res) => {
  res.status(501).send("Not implemented.");
})
.delete((req, res) => {
  res.status(501).send("Not implemented.");
});

export default productsRouter;
