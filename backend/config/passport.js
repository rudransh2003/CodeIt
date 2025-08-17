import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/users/google/callback", // no /api prefix
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Look for existing Google user
        let user = await userModel.findOne({ googleId: profile.id });

        if (!user) {
          // If not found by googleId, check if email already exists
          user = await userModel.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link existing account with Google
            user.googleId = profile.id;
            await user.save();
          } else {
            // Otherwise create a new Google-only user (no password)
            user = await userModel.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;