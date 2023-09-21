const mongoose = require('mongoose')
require('dotenv').config();
const User = require("../src/models/User");

// Data array containing seed data
const users = [
  new User({
    name: 'The User',
    email: 'user@email.com',
    username: 'user',
    password: 'User@123'
  }),]

// Connect to MongoDB via Mongoose
mongoose
  .connect(process.env.MONGODB_URL)
  .then(async db => {
    console.log('Successfully connected to MongoDB server');
    // Delete all existing users
    try {
      const deleteAll = await User.deleteMany({});
      if (deleteAll) {
        console.log('All Users removed');

        //save your data. this is an async operation
        //after you make sure you seeded all the products, disconnect automatically
        users.map(async (user, index) => {
          try {
            const savedUser = await user.save();
            if (savedUser) {
              console.log('Done', savedUser)
              mongoose.disconnect();
            }
          } catch (error) {
            console.log('Err', error)
          }
        });

      }
    } catch (error) {
      console.log('Error', error)
    }
  })
  .catch(err => {
    console.log(err)
  })
