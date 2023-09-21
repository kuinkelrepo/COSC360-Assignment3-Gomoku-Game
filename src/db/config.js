const mongoose = require('mongoose')
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(db => {
    console.log('Successfully connected to MongoDB server')
  })
  .catch(err => {
    console.log(err)
  })
