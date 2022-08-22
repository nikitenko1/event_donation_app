const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dvpy1nsjp/image/upload/v1635570881/sample.jpg',
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('user', userSchema);
module.exports = { User };
