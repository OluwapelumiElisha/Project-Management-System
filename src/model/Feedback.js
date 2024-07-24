const mongoose = require("mongoose");

const { Schema } = mongoose;

const feedbackSchema = Schema({
  textfield: {
    type: String,
    required: true,
   
  },
  feedback: {
    type: String,
    required: true,
  },
 
 
});

module.exports = mongoose.model("FeedBack", feedbackSchema);