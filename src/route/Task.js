const express = require('express');
const route = express.Router()
const authenticate = require('../middleWare/Auth');
const { handleCreateTask, getTasksByProject, deleteTask, updateTaskAssigned , getTasksAssignedToUser, handleComplete, handleTaskSummary} = require('../controller/Task');



route.post("/createTask", authenticate, handleCreateTask);
route.get('/tasks/:projectId', getTasksByProject);
route.delete('/deleteTask/:id',  deleteTask)
route.put('/tasks/:taskId/assign', updateTaskAssigned )
route.get('/taskAssignedToDisUser', authenticate, getTasksAssignedToUser);
route.post('/tasks/:id/complete', authenticate, handleComplete);
route.get('/task-summary', authenticate, handleTaskSummary)

module.exports = route