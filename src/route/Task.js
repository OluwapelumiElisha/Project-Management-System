const express = require('express');
const route = express.Router()
const authenticate = require('../middleWare/Auth');
const { handleCreateTask, getTasksByProject } = require('../controller/Task');



route.post("/createTask", authenticate, handleCreateTask);
route.get('/tasks/:projectId', getTasksByProject);
// route.get("/getUserProject", authenticate,  handleGetProject);
// route.delete('/deleteUserProject/:id',  deleteUserProject)
// route.post();
// route.post();

module.exports = route