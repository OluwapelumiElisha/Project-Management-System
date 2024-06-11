const mongoose = require("mongoose");
const { Schema } = mongoose
const taskSchema = Schema({
  name: {
    type: String,
    required: [true, "A task should have a name"],
    index: true,
  },

  description: {
    type: String,
    required: [true, "Please provide a description"],
  },


  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },



  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Projects",
  },

//   collaborators: [
//     {
//       user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Users",
//       },
//       role: {
//         type: String,
//         enum: ["viewer", "editor"],
//         default: "viewer",
//       },
//     },
//   ],

  startDate: {
    type: Date,
    default: Date.now,
    immutable: true,
  },

  dueDate: {
    type: Date,
  },

  completed: {
    type: Boolean,
    default: false,
  },

})




const Tasks = mongoose.model("Tasks", taskSchema);

module.exports = Tasks;