const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  googleid: String,
  githubid: String,
  userType: {
    type: String,
    enum: ['Developer', 'Company', 'Organization'],
  },
});

const developerSchema = new mongoose.Schema({
  selfHosting: Boolean,
  xeroCodeHosting: Boolean,
});

const companySchema = new mongoose.Schema({
  name: String,
});

const organizationSchema = new mongoose.Schema({
  name: String,
});

userSchema.plugin(passportLocalMongoose); // Apply passport-local-mongoose to userSchema

userSchema.statics.findOrCreate = async function (field, value) {
  try {
    const condition = {};
    condition[field] = value;

    const existingUser = await this.findOne(condition);
    if (existingUser) {
      return existingUser;
    }

    console.log('User not found, creating a new user');
    const newUser = new this({ [field]: value });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
userSchema.statics.findByGoogleId = async function (googleId) {
  try {
    return await this.findOne({ googleid: googleId });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
userSchema.statics.findByGithubId = async function (githubId) {
  try {
    return await this.findOne({ githubid: githubId });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


const User = mongoose.model('User', userSchema);
const Developer = User.discriminator('Developer', developerSchema);
const Company = User.discriminator('Company', companySchema);
const Organization = User.discriminator('Organization', organizationSchema);

module.exports = {
  User,
  Developer,
  Company,
  Organization,
};
