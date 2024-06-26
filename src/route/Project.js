const express = require('express');
const { handleCreateProject, handleGetProject, deleteUserProject, getProjectsWithTasksAndAssignedUsers } = require('../controller/Project');
const authenticate = require('../middleWare/Auth');
const route = express.Router()




route.post("/createProject", authenticate, handleCreateProject);
route.get("/getUserProject", authenticate,  handleGetProject);
route.delete('/deleteUserProject/:id',  deleteUserProject)
route.get('/getuiuiut', authenticate, getProjectsWithTasksAndAssignedUsers)
// route.post();
// route.post();

module.exports = route