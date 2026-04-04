import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import {
  registerUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
} from "../db.js";
import {
  validateEmail,
  validatePhone,
  validateUsername,
  validatePassword
} from "../validate.js";
import { authorize } from "../middleware.js";

const SALT_ROUNDS = 10;

const usersRouter = Router();

usersRouter.post("/auth", passport.authenticate("local"), async (req, res) => {
  res.status(200).json(await req.user);
});

usersRouter.post("/register", async (req, res) => {
  try {
    const email = validateEmail(req.body.email);
    const phone = validatePhone(req.body.phone);
    const username = validateUsername(req.body.username);
    const password = validatePassword(req.body.password);

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);

    await registerUser(
      username,
      passwordHash,
      email,
      phone
    );

    res.status(201).json({
      email,
      phone,
      username
    });
  } catch (err) {
    res.status(400).send("Invalid input received!");
  }
});

usersRouter.get("/logout", (req, res, next) => {
  if (req.user) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send("Logged out successfully.");
    });
  } else {
    res.status(200).send("Nothing to do.");
  }
});

usersRouter.route("/me")
.get(authorize("user"), (req, res) => {
  res.status(200).send(req.user);
})
.put(authorize("user"), async (req, res) => {
  try {
    const newUserdata = {
      email: req.body.email && validateEmail(req.body.email),
      phone: req.body.phone && validatePhone(req.body.phone),
      username: req.body.username && validateUsername(req.body
      .username),
      password: req.body.password && validatePassword(req.body.password)
    }

    if (newUserdata.password) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      newUserdata.password = await bcrypt.hash(newUserdata.password,
        salt);
    }

    updateUser(req.user.id, newUserdata);

    req.user = {
      id: req.user.id,
      email: newUserdata.email || req.user.email,
      phone: newUserdata.phone || req.user.phone,
      username: newUserdata.username || req.user.username
    };

    res.status(200).json(req.user);
  } catch (err) {
    res.status(400).send("Invalid data given!");
  }
});

usersRouter.get("/users", authorize("admin"), async (req, res) => {
  try {
    const users = await getUsers(req.body);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

usersRouter.route("/users/:userId")
.get(authorize("admin"), async (req, res) => {
  try {
    const user = await getUserById(Number(req.params.userId));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found!");
    }
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
})
.delete(authorize("admin"), async (req, res) => {
  try {
    const user = await getUserById(Number(req.params.userId));
    if (user) {
      await deleteUser(user.id);
      res.status(204).send();
    } else {
      res.status(404).send("User not found!");
    }
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

export default usersRouter;
