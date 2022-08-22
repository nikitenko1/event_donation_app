const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    expireRegistration: {
      type: Date,
      required: true,
    },
    timeStart: {
      type: String,
      required: true,
    },
    timesUp: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    registrant: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'history',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('event', eventSchema);
module.exports = { Event };
