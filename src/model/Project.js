
const mongoose = require("mongoose");
const { Schema } = mongoose
const projectSchema = Schema({
  name: {
    type: String,
    unique: [true, "Project with this name already exist"],
    required: [true, "Project name is required"],
  },

  description: {
    type: String,
    required: [true, "Project description is required"],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  // members: [
  //   {
  //     user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Users",
  //     },
  //     permissions: {
  //       type: [String],
  //     },
  //   },
  // ],

  startDate: {
    type: Date,
    default: Date.now,
  },
  
  endDate: {
    type: Date,
  },
  weekOfMonth:{
    type: Number
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
    },
  ],
});
projectSchema.pre('save', function(next){
  const startDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 1);
  const dayOfMonth = this.startDate.getDate();
  const weekNumber = Math.ceil((dayOfMonth + startDate.getDay()) /7);
  this.weekOfMonth = weekNumber;
  next()
})

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;