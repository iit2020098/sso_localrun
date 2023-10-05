// google.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config();
const { User } = require("../models/User"); // Adjust the path as needed

function initializeGoogleStrategy() {
  passport.use(
    new GoogleStrategy(
    {
      clientID: process.env.googleclientID,
      clientSecret: process.env.googleclientSecret,
      callbackURL: process.env.googlecallbackURL, // Replace with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        const user = await User.findOne({'googleid':profile.id});
        console.log(user);

        if (!user) {
          const newUser = new User({
            googleid: profile.id,
            firstname: profile.name.givenName ,
            lastname: profile.name.familyName ,
            password: null, 
            email: profile.emails[0].value,
          });

          console.log("New User object:", newUser);

          
          await newUser.save();
          console.log("Google user created");

          return done(null, newUser);
        } else {
          console.log("Google user already exists");
          console.log(user);
          console.log("we are out of google strategy")
          return done(null, user);
        }
      } catch (error) {
        console.log("Error in creating a user:", error);
        return done(error);
      }
    }
  )
);
}

module.exports = {
  initializeGoogleStrategy,
};