import passport from "passport";
import { getUserPriveleges } from "./db.js";

/**
  Middleware helper to detect if a user has authorization to execute a specific
task.
*/
export function authorize(role) {
  switch (role) {
    case "user":
      return (req, res, next) => {
        if (req.isAuthenticated()) {
          next();
        } else {
          res.status(403).send("Forbidden.");
        }
      }
    case "admin":
    case "owner":
      return async (req, res, next) => {
        if (req.isAuthenticated()) {
          const privilages = await getUserPriveleges(req.user.id);
          if (privilages.role === "admin" || privilages.role === "owner") {
            return next();
          }
        }
        res.status(403).send("Forbidden.");
      };
    default:
      console.error(`Invalid role ${role}!`);
  }
}
