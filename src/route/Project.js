const express = require('express');
const { handleCreateProject } = require('../controller/Project');
const route = express.Router()





route.post("/createProject", handleCreateProject);
// route.get("/getProject", handleGetProject);
// route.post();
// route.post();

module.exports = route