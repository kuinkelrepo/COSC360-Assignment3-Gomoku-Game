const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const userAuth = require('../auth/UserAuth')
const UserController = require('../controllers/UserController')

// for user egistation
router.post('/register', UserController.checkIfUserExist, async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
    res.status(201).json({
      token: token,
      message: 'User has been created successfully.'
    })
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({ error: { status: 400, message: Object.values(error.errors)?.[0].message } });
    }
    res.status(500).send("Something went wrong");
    throw new Error(error)
  }
})

// for user login
router.post('/login', UserController.verifyUser, async (req, res) => {
  const user = req.user
  try {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
    res.status(200).json({
      token: token,
      message: 'Login successful.'
    })
  } catch (error) {
    throw new Error(error)
  }
})


// to get user profile
router.get('/users/me', userAuth, async (req, res) => {
  res.status(200).send(req.user)
})

module.exports = router
