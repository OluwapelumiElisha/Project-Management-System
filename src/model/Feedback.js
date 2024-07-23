const mongoose = require("mongoose");

const { Schema } = mongoose;

const feedbackSchema = Schema({
  email: {
    type: String,
    required: "email is require",
    trim: true,
    unique: true,
  },
  otps: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
 
});

module.exports = mongoose.model("FeedBack", feedbackSchema);