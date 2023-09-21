const mongoose = require('mongoose')
// const validator = require('validator')

const gameSchema = new mongoose.Schema(
  {
    size: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    result: {
      type: String,
      required: true,
      default: 'Black'
    },
    status: {
      type: String,
      required: true,
      default: 'INPROGRESS'
    },
    moves: [
      {
        row: {
          type: Number,
          required: true,
        },
        col: {
          type: Number,
          required: true,
        },
        player: {
          type: Number,
          required: true,
        }
      }
    ],
    played_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
)


// sending only necessary data from user collection.
gameSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.createdAt
  delete userObject.updatedAt
  delete userObject.__v
  return userObject
}

// // Hashing the plain text password before saving.
// gameSchema.pre('save', async function (next) {
//   const user = this
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8)
//   }
//   next()
// })

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
