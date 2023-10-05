// mongo.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    // Extract user registration data from the request body
    const { firstName, lastName, email, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // If a user with the same email exists, respond with an error message
      console.log('User with this email already exists');
      return res.status(400).json({ error: 'User with this email already exists.Please login.' });
    }

    // Create a new User instance
    const newUser = new User({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    console.log('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle errors
    console.log('An error occurred during registration');
    console.error('User registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

module.exports = router;
