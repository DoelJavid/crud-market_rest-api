import passport from "passport";
import LocalStrategy from "passport-local";
import { authenticateUser } from "./db.js";

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
  async function verify(email, password, done) {
    try {
      const user = await authenticateUser(email, password);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  process.nextTick(() => done(null, {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone
  }));
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => done(null, user));
});
