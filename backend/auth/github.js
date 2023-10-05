// github.js
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
require('dotenv').config();
const { User } = require("../models/User"); // Adjust the path as needed

function splitFullName(fullName) {
  const nameParts = fullName.match(/([^\s]+)\s(.+)/);

  let firstName = '';
  let lastName = '';

  if (nameParts && nameParts.length === 3) {
    firstName = nameParts[1];
    lastName = nameParts[2];
  } else if (nameParts && nameParts.length === 2) {
    firstName = nameParts[1];
  } else {
    firstName = fullName;
  }

  return { firstName, lastName };
}


function initializeGitHubStrategy() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.gitclientID,
        clientSecret: process.env.gitclientSecret,
        callbackURL: process.env.gitcallbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({'githubid':profile.id});


          if (!user) {
            const { firstName, lastName } = splitFullName(profile.displayName);
            console.log("Split names - First:", firstName, "Last:", lastName);
            
            const newUser = new User({
              githubid: profile.id,
              firstname: firstName || '',
              lastname: lastName || '',
              password: null, 
              email: profile._json.email,
            });

            console.log("New User object:", newUser);

            
            await newUser.save();
            console.log("GitHub user created");

            return done(null, newUser);
          } else {
            console.log("GitHub user already exists");
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
  initializeGitHubStrategy,
};
