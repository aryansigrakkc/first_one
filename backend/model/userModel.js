const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const userSchema = new Schema({
  name: {
    required: true,
    type: 'string',
    trim: true,
  },
  email: {
    required: true,
    type: 'string',
    trim: true,
  },
  password: {
    required: true,
    type: 'string',
  },
  contact: {
    required: true,
    type: 'number',
  },
  address: {
    required: true,
    type: 'string',
  },
  gender: {
    type: 'string',
    enum: ["male", "female"],
  },
  role: {
    type: 'string',
    enum: ["admin", "user"],
    default: "user", // default user
  },
}, {
  timestamps: true,
});

module.exports = new mongoose.model("user", userSchema);
