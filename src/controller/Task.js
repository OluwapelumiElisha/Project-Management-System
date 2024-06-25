const Projects = require("../model/Project");
const Tasks = require("../model/Task");
const User = require("../model/Auth")
const handleCreateTask = async (req, res) => {
  const user = req.user;

  try {
    const { name, description, project, assignedBy } = req.body;

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
    const task = await Tasks.create({ name, description, project, user: user._id, assignedBy: user._id });
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



const deleteTask = async(req, res) =>{
  const id = req.params.id
  
  try {
      const response = await Tasks.findByIdAndDelete(id)
      res.status(200).json({message: "Task Deleted Successfully", response}).status(202)
  } catch (error) {
      console.log(error);
      res.status(500).json({message: "Is an error", error}).status(505)
  }
 
}

const updateTaskAssigned = async(req, res) =>{
  const { userId } = req.body;
  const taskId = req.params.taskId;
  try {
    const task = await Tasks.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Check if the user is already assigned
    const alreadyAssigned = task.assignedTo.some(item => item.userId.equals(userId));

    if (alreadyAssigned) {
      return res.status(400).json({ error: 'User is already assigned to this task.' });
    }

    // Assign the user to the task
    task.assignedTo.push({ userId, completed: false });

    await task.save();
    res.json({ message: `User ${userId} assigned to task ${taskId}` });
  } catch (err) {
    console.error('Error assigning task to user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
// const getTasksAssignedToUser = async(req, res) =>{
//   const user = req.user;
//   try {
//     const tasks = await Tasks.find({ assignedTo: user.id});

//     if (!tasks.length) {
//       return res.status(404).json({ message: "No tasks found for this user" });
//     }

//     res.status(200).json({
//       status: "success",
//       tasks,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// }
// const getTasksAssignedToUser = async (req, res) => {
//   const user = req.user;

//   try {
//     // Find tasks assigned to the user
//     const tasks = await Tasks.find({ assignedTo: user.id });

//     if (!tasks.length) {
//       return res.status(404).json({ message: "No tasks found for this user" });
//     }

//     // Get the project details for each task
//     const tasksWithProject = await Promise.all(tasks.map(async (task) => {
//       const project = await Projects.findById(task.project).select('name description');
//       return {
//         ...task._doc,
//         project: project || null
//       };
//     }));

//     res.status(200).json({
//       status: "success",
//       tasks: tasksWithProject,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const getTasksAssignedToUser = async (req, res) => {
  const user = req.user;
  // userId = user._id
  try {
    // Find tasks assigned to the user
    const tasks = await Tasks.find({ 'assignedTo.userId': user._id });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    // Get the project details and assigner details for each task
    const tasksWithDetails = await Promise.all(tasks.map(async (task) => {
      try {
        // Extract the specific assignment for the user
        const userAssignment = task.assignedTo.find(assignment => assignment.user._id.equals(user._id));
        
        // Fetch project details if project exists
        const project = task.project ? await Projects.findById(task.project).select('name description') : null;

        // Fetch assignedBy user details if assignedBy exists
        const assignedBy = task.assignedBy ? await User.findById(task.assignedBy).select('image') : null;

        return {
          ...task._doc,
          project: project || null,
          assignedBy: assignedBy || null,
          userAssignment: userAssignment || null, // Include the specific assignment details for the user
        };
      } catch (err) {
        console.error(`Error fetching details for task ${task._id}:`, err);
        return {
          ...task._doc,
          project: null,
          assignedBy: null,
          userAssignment: null,
        };
      }
    }));

    res.status(200).json({
      status: "success",
      tasks: tasksWithDetails,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: "Server error" });
  }
};

  const handlecomplete = async(req, res) =>{
    const user = req.user;
    Id = user._id
    const taskId = req.params.id;
    console.log(taskId)
    try {
      const task = await Tasks.findOne({ _id: taskId, 'completedBy.userId': Id });
      console.log(task)
      if (!task) {
        return res.status(404).json({ error: 'Task not found or user is not assigned to it.' });
      }
  
      const userIndex = task.completedBy.findIndex(item => item.userId.equals(Id));
      task.completedBy[userIndex].completed = true;
  
      await task.save();
      res.json({ message: `Task ${taskId} marked as completed by user ${Id}` });
    } catch (err) {
      console.error('Error marking task as completed:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  // const handleDone = async(req, res) =>{
  //   try {
  //   let response = await Tasks.find({ completed: true })
  //   console.log(response);
  //   return res.status(200).json({ message: response});
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
module.exports = { handleCreateTask , getTasksByProject, deleteTask, updateTaskAssigned , getTasksAssignedToUser, handlecomplete};
