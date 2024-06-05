const express = require('express');
const { handleCreateProject, handleGetProject } = require('../controller/Project');
const authenticate = require('../middleWare/Auth');
const route = express.Router()




route.post("/createProject", authenticate, handleCreateProject);
route.get("/getUserProject", authenticate,  handleGetProject);
// route.post();
// route.post();

module.exports = route