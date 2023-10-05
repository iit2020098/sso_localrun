const express = require("express");
const passport = require("passport");
const session = require("express-session");
const crypto = require('crypto'); // Import crypto for generating session secret
require('dotenv').config();
const mongoose = require('mongoose');
const { initializeGoogleStrategy } = require('./auth/google');
const { initializeGitHubStrategy } = require("./auth/github");
const app = express();
const cors = require('cors');
const mongoRouter = require("./auth/mongo");
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./models/User');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

// Generate a session secret
const sessionSecret = crypto.randomBytes(64).toString('hex');
// Set a cookie with a name, value, and optional attributes
function setCookie(name, value) {
  // Calculate the expiration date for 1 hour from now
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (1 * 60 * 60 * 1000)); // 1 hour in milliseconds

  // Create the cookie string with the expiration date
  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;

  // Set the cookie
  document.cookie = cookieString;
}



app.use(cors());
app.use(express.json());
app.use("/api", mongoRouter);
app.use(cookieParser());
// Add express-session middleware with the generated secret
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use the LocalStrategy with passport-local
passport.use(new LocalStrategy(User.authenticate()));
initializeGitHubStrategy();
initializeGoogleStrategy();
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



passport.serializeUser(function(user, done) {
  done(null, user._id);
  // if you use Model.id as your idAttribute maybe you'd want
  // done(null, user.id);
});

// passport.deserializeUser(function(id, done) {
// User.findById(id, function(err, user) {
//   done(err, user);
// });
// });
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


app.post('/api/login', async (req, res) => {
  console.log(req.body);
  console.log("Log in Post request");

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");
      return res.status(401).json({ error: 'User not found. Please try again.' });
    }

    console.log(user);
    if (user.password===password) {
      console.log("Login sucessful");
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(user,token)  
    // res.cookie("user", user._id)
    //   res.cookie("token", token)
      
      return res.status(200).json({ token, message: 'Login successful', user: user });
    } else {
      console.log("Authentication Failed");
      return res.status(401).json({ error: 'Authentication failed. Please try again.' });
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("error");
    return res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
});


app.get('/login', (req, res) => {
  console.log(req);
  res.send('Login page'); 
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
  function(req, res) {
    // console.log(req);
  });



app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.frontend_url}/Signin` }),
  function(req, res) {
    console.log("We are in google call back funection")
    console.log(req.cookies);
    const user = `user=${JSON.stringify(req.user)}`;
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    var s=req.cookies.userid;
    console.log("userid:-",s)
    res.cookie("userid", s)
      res.cookie("firstname", (req.user.firstname===undefined)?(""):req.user.firstname)
      res.cookie("token", token)
    if(req.user.userType===undefined)
    {  
      res.redirect(`${process.env.frontend_url}/FirstVisit`);
    }
    else {
      res.redirect(`${process.env.frontend_url}/Success`);
    }
  });

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // Handle GitHub OAuth authentication
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.frontend_url}/Signin` }),
  function(req, res) {
    const user = `user=${JSON.stringify(req.user)}`;
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("we are in github callback")
    
    var s=req.cookies.userid;
    
      res.cookie("userid", s)
      res.cookie("firstname", req.user.firstname)
      res.cookie("token", token)
    if(req.user.userType===undefined)
    {  
      
      res.redirect(`${process.env.frontend_url}/FirstVisit`);
    }
    else res.redirect(`${process.env.frontend_url}/Success`);
  });

  app.post(`/api/update`, async (req, res) => {
    try {
      const  userid=req.body.user;
      const userType = req.body.userType;
      
      console.log(req.body)
      console.log(userid)
      const user = await User.findOne({_id:userid});
      console.log(user);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.userType = userType;

      await user.save();
      console.log("After updatation",user);
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoURI = process.env.mongoURI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});