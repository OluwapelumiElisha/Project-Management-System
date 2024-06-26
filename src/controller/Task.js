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
const getTasksAssignedToUser = async (req, res) => {
  const userId = req.user._id;
  try {
    // Find tasks assigned to the user
    const tasks = await Tasks.find({ 'assignedTo.userId': userId });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    // Get the project details and assigner details for each task
    const tasksWithDetails = await Promise.all(tasks.map(async (task) => {
      try {
        // Extract the specific assignment for the user
        const userAssignment = task.assignedTo.find(assignment => assignment.userId.equals(userId));
        
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

const handleComplete = async (req, res) => {
  const userId = req.user._id;
  const taskId = req.params.id;

  try {
    // Find the task where the user is assigned to it
    const task = await Tasks.findOne({ _id: taskId, 'assignedTo.userId': userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or user is not assigned to it.' });
    }

    // Find the index of the user's assignment within the assignedTo array
    const userIndex = task.assignedTo.findIndex(item => item.userId.equals(userId));
    
    // Toggle the completed status
    task.assignedTo[userIndex].completed = !task.assignedTo[userIndex].completed;

    await task.save();
    res.json({ message: `Task ${taskId} completion status toggled by user ${userId}`, completed: task.assignedTo[userIndex].completed });
  } catch (err) {
    console.error('Error toggling task completion status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const handleTaskSummary = async (req, res) =>{
  const userId = req.user._id;
  console.log(userId)
  try {
    const result = await Projects.aggregate([
      {
        $match: { user: userId }
      },
      {
        $lookup: {
          from: "tasks",
          localField: "tasks",
          foreignField: "_id",
          as: "taskDetails",
        },
      },
      {
        $unwind: "$taskDetails",
      },
      {
        $unwind: "$taskDetails.assignedTo",
      },
      {
        $group: {
          _id: {
            projectId: "$_id",
            userId: "$taskDetails.assignedTo.userId",
          },
          projectName: { $first: "$name" },
          userId: { $first: "$taskDetails.assignedTo.userId" },
          assignedTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: ["$taskDetails.assignedTo.completed", 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          projectId: "$_id.projectId",
          projectName: 1,
          userId: 1,
          userName: "$userDetails.name",
          assignedTasks: 1,
          completedTasks: 1,
        },
      },
      {
        $sort: {
          projectId: 1,
          userId: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}



module.exports = { handleCreateTask , getTasksByProject, deleteTask, updateTaskAssigned , getTasksAssignedToUser, handleComplete, handleTaskSummary};
