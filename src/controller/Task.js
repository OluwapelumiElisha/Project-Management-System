const Projects = require("../model/Project");
const Tasks = require("../model/Task");

const handleCreateTask = async (req, res) => {
  const user = req.user;

  try {
    const { name, description, project } = req.body;

    // Check if name and description are provided
    if (!name || !description) {
      return res.status(400).json({ message: "Please provide name and description" });
    }

    // Check if the project exists
    const existingProject = await Projects.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Create the new task
    const task = await Tasks.create({ name, description, project, user: user._id });
    if (!task) {
      return res.status(500).json({ message: "Failed to create new task" });
    }

    // Add the task to the project's tasks array and save the project
    existingProject.tasks.push(task._id);
    await existingProject.save();

    res.status(200).json({
      status: "success",
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getTasksByProject = async (req, res) => {
  try {
      const { projectId } = req.params;
      console.log(projectId)
      const tasks = await Tasks.find({ project: projectId });

      if (!tasks.length) {
          return res.status(404).json({ message: "No tasks found for this project" });
      }

      res.status(200).json({
          status: "success",
          tasks,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};
module.exports = { handleCreateTask , getTasksByProject};
