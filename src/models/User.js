const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isLength(value, { min: 4, max: 50 })) {
          throw Error("Length of the username should be between 4-50");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 5, max: 50 })) {
          throw Error("Length of the password should be between 5-50");
        }
      },
    }
  },
  {
    timestamps: true,
  }
)

userSchema.virtual('Game', {
  ref: 'Game',
  localField: '_id',
  foreignField: 'played_by',
})

// sending only necessary data from user collection.
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.createdAt
  delete userObject.updatedAt
  delete userObject.__v
  return userObject
}

// Hashing the plain text password before saving.
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
