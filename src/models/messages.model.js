const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const messageSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

/**
 * @typedef User
 */
const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;
