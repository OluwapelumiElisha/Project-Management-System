
const Project = require("../model/Project");
const User = require('../model/Auth')
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
        const getUserProjects = await Project.find({ user })
        // const response = await Projects.findById(user.id)
        //  console.log(response);
         res.status(200).json({
            status: "success",
            message: "Get all User Project",
            getUserProjects,
        });
       } catch (error) {
        console.log(error);
       }
}
  const deleteUserProject = async(req, res) =>{
    // const user = req.user
    const id = req.params.id
    
    try {
        const response = await Project.findByIdAndDelete(id)
        res.status(200).json({message: "Project Deleted Successfully", response}).status(202)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Is an error", error}).status(505)
    }
   
}
const getProjectsWithTasksAndAssignedUsers = async (req, res) => {
    const user = req.user
    try {
      const projects = await Project.find({ user })
        .populate({
          path: 'tasks',
          populate: {
            path: 'assignedTo.userId',
            model: 'User'
          }
        })
        .exec();
  
      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: "No projects found" });
      }
  
      // Prepare response data in the format you need
      const projectsWithTasksAndUsers = projects.map(project => ({
        id: project._id,
        name: project.name,
        description: project.description,
        tasks: project.tasks.map(task => ({
          id: task._id,
          name: task.name,
          description: task.description,
          assignedTo: task.assignedTo.map(assignee => ({
            userId: assignee.userId._id,
            userName: assignee.userId.name, // Assuming User model has a 'name' field
            completed: assignee.completed
          }))
        }))
      }));
  
      res.status(200).json(projectsWithTasksAndUsers);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = { handleCreateProject, handleGetProject, deleteUserProject, getProjectsWithTasksAndAssignedUsers };
