const express = require('express');
const route = express.Router()



route.post("/feedBack", authenticate, handleFeedBack);





module.exports = route