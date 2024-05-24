const express = require('express')
const route = express.Router()
const { handleSignUp, handleOtpverify, handleLogIn, handleCheckAuth, handleForgetPassword, handleforgetPassOtp, handleChangePassword } = require('../controller/Auth');
const { verifyToken } = require('../middleWare/verifyToken');
const multerUploads = require('../utils/MulterUpload');




route.post('/signUpuser', multerUploads.single('image'), handleSignUp);
route.post("/verifyotp", handleOtpverify);
route.post("/loginuser", handleLogIn);
route.post("/checkauth", verifyToken, handleCheckAuth);
route.post('/forgetPassword', handleForgetPassword)
route.post("/forgetPassOtp", handleforgetPassOtp);
route.patch("/changePassword", handleChangePassword);






module.exports = route



