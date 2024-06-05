// const mongoose = require('mongoose')
// const { Schema } = mongoose

// const ProjectSchema = Schema({
//     name: {
//         type: String,
//         unique: [true, "Project with this name already exist"],
//         required: [true, "Project name is required"],
//       },
//       description: {
//         type: String,
//         required: [true, "Project description is required"],
//       },
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//       },
//       startDate: {
//         type: Date,
//         default: Date.now,
//       },
    
//       endDate: {
//         type: Date,
//       },
// })

// module.exports = mongoose.model('Project', ProjectSchema)



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

  // tasks: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Tasks",
  //   },
  // ],
});

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;