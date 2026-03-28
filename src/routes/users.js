import { Router } from "express";

const usersRouter = Router();

usersRouter.post("/auth", (req, res) => {
  res.status(501).send("Not implemented");
});

usersRouter.post("/register", (req, res) => {
  res.status(501).send("Not implemented");
});

usersRouter.get("/logout", (req, res) => {
  res.status(501).send("Not implemented");
});

usersRouter.route("/me")
.get((req, res) => {
  res.status(501).send("Not implemented");
})
.put((req, res) => {
  res.status(501).send("Not implemented");
});

usersRouter.get("/users", (req, res) => {
  res.status(501).send("Not implemented");
});

usersRouter.route("/users/:userId")
.get((req, res) => {
  res.status(501).send("Not implemented");
})
.delete((req, res) => {
  res.status(501).send("Not implemented");
});

export default usersRouter;
