const express = require('express');
const route = express.Router()
const authenticate = require('../middleWare/Auth');
const { handleCreateTask, getTasksByProject, deleteTask, updateTaskAssigned , getTasksAssignedToUser, handlecomplete} = require('../controller/Task');



route.post("/createTask", authenticate, handleCreateTask);
route.get('/tasks/:projectId', getTasksByProject);
route.delete('/deleteTask/:id',  deleteTask)
route.put('/tasks/:taskId/assign', updateTaskAssigned )
route.get('/taskAssignedToDisUser', authenticate, getTasksAssignedToUser);
route.post('/complete/:id', authenticate,  handlecomplete)
// route.get('/mark-completed', handleDone)
// route.get("/getUserProject", authenticate,  handleGetProject);
// route.delete('/deleteUserProject/:id',  deleteUserProject)
// route.post();
// route.post();

module.exports = route