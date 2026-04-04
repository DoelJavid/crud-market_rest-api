import { Router } from "express";
import * as z from "zod";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../db.js";
import { authorize } from "../middleware.js";

const Product = z.object({
  name: z.string().max(50).regex(/^[a-z]+( [a-z]+)*$/i),
  description: z.string().trim(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int(),
  category: z.string().max(32).regex(/^[a-z]+( [a-z]+)*$/i)
});
const PartialProduct = Product.partial();
const productsRouter = Router();

productsRouter.route("/products")
.get(async (req, res) => {
  const products = await getProducts(req.body);
  res.status(200).json(products);
})
.post(authorize("admin"), async (req, res) => {
  try {
    const product = Product.parse(req.body);
    await createProduct(product);
    res.status(201).send(product);
  } catch (err) {
    res.status(400).send("Invalid data given!");
  }
});

productsRouter.route("/products/:productId")
.get(async (req, res) => {
  const product = await getProductById(Number(req.params.productId));
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).send("Product not found.");
  }
})
.put(authorize("admin"), async (req, res) => {
  const productId = Number(req.params.productId);
  const product = await getProductById(productId);
  if (product) {
    try {
      const productUpdate = PartialProduct.parse(req.body);
      for (const prop in productUpdate) {
        product[prop] = productUpdate[prop];
      }
      updateProduct(product.id, product);
      res.status(200).json(product);
    } catch (err) {
      res.status(400).send("Invalid data given.");
    }
  } else {
    res.status(404).send("Product not found.");
  }
})
.delete(authorize("admin"), async (req, res) => {
  const productId = Number(req.params.productId);
  const product = await getProductById(productId);
  if (product) {
    await deleteProduct(productId);
    res.status(204).send();
  } else {
    res.status(404).send("Product not found.");
  }
});

export default productsRouter;
