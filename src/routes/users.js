import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import {
  registerUser,
  authenticateUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  getUserPriveleges
} from "../db";
import {
  validateEmail,
  validatePhone,
  validateUsername,
  validatePassword
} from "../validate.js";

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
.get((req, res) => {
  if (req.user) {
    res.status(200).send(req.user);
  } else {
    res.status(403).send("Forbidden.");
  }
})
.put(async (req, res) => {
  try {
    if (req.user) {
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
    } else {
      res.status(403).send("Forbidden.");
    }
  } catch (err) {
    res.status(400).send("Invalid data given!");
  }
});

async function validateAdmin(req, res, next) {
  if (req.user) {
    const privilages = await getUserPriveleges(req.user.id);
    if (privilages === "admin" || privilages === "owner") {
      return next();
    }
  }
  res.status(403).send("Forbidden.");
}

usersRouter.get("/users", validateAdmin, async (req, res) => {
  try {
    const users = await getUsers(req.body);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

usersRouter.route("/users/:userId")
.get(validateAdmin, async (req, res) => {
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
.delete(validateAdmin, async (req, res) => {
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
