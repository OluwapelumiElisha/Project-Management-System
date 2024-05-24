const mongoose = require('mongoose')
const { Schema } = mongoose

const ProjectSchema = Schema({
    name: {
        type: String,
        unique: [true, "Project with this name already exist"],
        required: [true, "Project name is required"],
      },
      description: {
        type: String,
        required: [true, "Project description is required"],
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
    
      endDate: {
        type: Date,
      },
})

module.exports = mongoose.model('Project', ProjectSchema)