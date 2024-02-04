import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import AuthService from "./services/auth.service";

export function initPassport() {
  const authService = new AuthService();
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await authService.verifyCredentials(email, password);
          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}
