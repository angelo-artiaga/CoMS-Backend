import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { encodeToken } from "./token.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN_NAME}/google/callback`,
    },
    function (request, accessToken, refreshToken, profile, done) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     console.log(user);
      //     return done(err, user);
      //   });
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
