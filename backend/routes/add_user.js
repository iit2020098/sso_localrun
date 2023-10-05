const express = require('express');
const router = express.Router();
const { User, Developer, Company, Organization } = require('../models/User.js'); // Import your model file
router.use(express.json());


router.post('/add_user', async (req, res) => {
  try {
    // Check if the email address is already in use in the database
    const emailExists = await User.exists({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email address already in use' });
    }

    // Create a new user object based on the request body
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      userType: req.body.userType,
    });
    console.log(newUser);
    // Depending on the userType, create a user of the appropriate subtype
    let savedUser;
    switch (req.body.userType) {
      case 'Developer':
        savedUser = await Developer.create({
          ...newUser.toObject(),
          selfHosting: req.body.selfHosting,
          xeroCodeHosting: req.body.xeroCodeHosting,
        });
        break;
      case 'Company':
        savedUser = await Company.create({
          ...newUser.toObject(),
          name: req.body.name,
        });
        break;
      case 'Organization':
        savedUser = await Organization.create({
          ...newUser.toObject(),
          name: req.body.name,
        });
        break;
      default:
        return res.status(400).json({ message: 'Invalid userType' });
    }

    // Send a success response with the saved user object
    res.status(201).json(savedUser);
  } catch (err) {
    // Send an error response if there is an error saving the user to the database
    res.status(500).json({ message: err.message });
  }
});
// POST request to update user by _id and change userType
router.post('/update', async (req, res) => {
  try {
    const { _id, userType } = req.body;

    // Find the user by _id
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user);
    user.userType = userType;

    // Save the updated user
    await user.save();
    console.log("After updatation",user);
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;

