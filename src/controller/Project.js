// const { default: mongoose } = require("mongoose");
const Projects = require("../model/Project");
const Project = require("../model/Project");

const mongoose = require('mongoose')
// function to create which project 
const handleCreateProject = async (req, res) => {
  // from the middleware Auth
    const user = req.user;  

    try {
        const { name, description } = req.body;
        
        if (!name || !description) {
            return res.status(400).json({ message: "Please provide name and description" });
        }

        const project = await Project.create({ name, description, user: user.id });

        if (!project) {
            return res.status(500).json({ message: "Failed to create new project" });
        }

        user.projects.push(project.id);
        await user.save();

        res.status(200).json({
            status: "success",
            message: "New Project created successfully",
            project,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating project", error });  
    }
}
const handleGetProject = async (req, res) =>{
        const user = req.user
       try {
        // const { user } = req.params
        console.log(user);
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({message: "invaild"})
        }
        const response = await Projects.find({ user })
        // const response = await Projects.findById(user.id)
         console.log(response);
       } catch (error) {
        console.log(error);
       }
}

module.exports = { handleCreateProject, handleGetProject };
