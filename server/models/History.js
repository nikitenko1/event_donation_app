const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'user',
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: 'event',
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model('history', historySchema);
module.exports = { History };
