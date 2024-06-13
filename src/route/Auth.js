const express = require('express')
const route = express.Router()
const { handleSignUp, handleOtpverify, handleLogIn, handleCheckAuth, handleForgetPassword, handleforgetPassOtp, handleChangePassword, handleGetAllUser, checkUserActivity } = require('../controller/Auth');
const { verifyToken } = require('../middleWare/verifyToken');
const multerUploads = require('../utils/MulterUpload');
const authenticate = require('../middleWare/Auth');
const updateLastActive = require('../middleWare/active');




route.post('/signUpuser', multerUploads.single('image'), handleSignUp);
route.post("/verifyotp", handleOtpverify);
route.post("/loginuser", handleLogIn);
route.get("/checkAuth", verifyToken, handleCheckAuth);
route.post('/forgetPassword', handleForgetPassword)
route.post("/forgetPassOtp", handleforgetPassOtp);
route.patch("/changePassword", handleChangePassword);
route.get('/getAllUser', authenticate, handleGetAllUser)
route.get('/users/:id/is-active', updateLastActive, checkUserActivity);






module.exports = route



