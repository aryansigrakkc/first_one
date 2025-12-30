const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({

  name: {
    required: true,
    type: String,
    trim: true,
  },

  short_desc: {
    required: true,
    type: String,
    trim: true,
  },

  long_desc: {
    required: true,
    type: String,
    trim: true,
  },

  image: {
    type: String,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  
likes: [
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    name: { type: String },
    email: { type: String }
  }
],
comments: [
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    name: { type: String },
    email: { type: String },
    text: { type: String }
  }
]


}, {
  timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);
