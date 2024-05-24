const User = require("../model/Auth");
// const { UserZodSchema } = require("../utils/zodSchema");
const UserZodSchema = require("../utils/ZodSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require('../utils/Cloudinary-Setup')

const createToken = (id, email) => {
  return jwt.sign({ email, id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
const Otpmodel = require("../model/otps");
const { sendVerificationCode, sendWelcomeEmail } = require("../mailer");

// const jwt = require("jsonwebtoken");

async function handleSignUp(req, res) {
  let { firstName, lastName, email, gender, phone, password, createdAt, image} = req.body;
  try {
    const result = await cloudinary.uploader.upload(req.file.path,{
      folder: 'PMS image',
  })
    let validatedData = UserZodSchema.parse({
      firstName,
      lastName,
      email,
      gender,
      phone,
      password,
      createdAt,
      image: result.secure_url
    });
    const salt = await bcrypt.genSalt();

    validatedData.password = await bcrypt.hash(password, salt);
    // make my validation validation

    const response = await User.create(validatedData);
    const name = firstName + " " + lastName;
    // await sendWelcomeEmail({ name, email });
    res.status(200).json(validatedData);
    console.log(validatedData);

    handleSendOtpVerification({ email });
  } catch (error) {
    res.status(500).json({ error: "error creating data", error });
    console.log(error);
  }
}

const handleSendOtpVerification = async ({ res, email }) => {
  try {
    console.log(email);
    //   creating a random otp
    let otp = `${Math.floor(1000 + Math.random() * 900000)}`;
    const salt = await bcrypt.genSalt();
    //   hashing the otp
    let otps = await bcrypt.hash(otp, salt);
    //   creating the otp in the database
    const response = await Otpmodel.create({
      email,
      createdAt: Date.now(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      otps,
    });
    //   sending the otp to user email
    await sendVerificationCode({ email, otp });
    // res.json(response);
    console.log(response);
  } catch (error) {
    res.staus(400).json({ message: "Error", error });
    console.log(error);
  }
};

const handleOtpverify = async (req, res) => {
  const { email, otps } = req.body;
  try {
    if (!email || !otps) {
      return res.status(404).json({ message: "please fill all details" });
    }
    const userOtpVerificationRecord = await Otpmodel.find({ email });
    if (userOtpVerificationRecord.length <= 0) {
      return res.status(404).json({
        message:
          "Account Record not found or Already verify, Sign up or log in",
      });
    }
    console.log(userOtpVerificationRecord);
    const { createdAt, expiresAt } = userOtpVerificationRecord[0];
    const hashOtp = userOtpVerificationRecord[0].otps;
    console.log(expiresAt, "here");

    if (expiresAt < Date.now()) {
      await Otpmodel.deleteMany({ email });
      return res
        .status(200)
        .json({ message: "otp expire, request for another one" });
    }
    const isMatch = await bcrypt.compare(otps, hashOtp);
    if (!isMatch) {
      return res.status(404).json({ message: "invalid Otp check your mail" });
    }

    if(isMatch){
      await Otpmodel.deleteMany({ email });
      await sendWelcomeEmail({ email });
      await User.updateOne({email}, { isEmailVerify : true})
      return res.status(200).json({ message: "otp verified" });
    }

    res.json("hello");
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};


async function handleLogIn(req, res) {
  const { email, password } = req.body;
  // checking if user input eamil or password
  try {
    if (!email || !password) {
      return res.status(404).json({ message: "please fill all details" });
    }

    //  checking and fectching user data in the data base

    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res.status(404).json({ message: "invalid login Credentail" });
    }

    //  checking if the password is correct
    const isMatch = await bcrypt.compare(password, userDetails.password);
    if (!isMatch) {
      return res.status(404).json({ message: "invalid login Credentail" });
    }

    if(userDetails.isEmailVerify == false){
        return res.status(404).json({message: "Your Account is not Verify Yet"})
    }

    //  creating a token for login user with jwt
    const token = createToken(userDetails._id, userDetails.email);

    res.json({ message: "u are logged in", token });
    console.log(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error creating data", error });
  }
}

const handleCheckAuth = async (req, res) => {
  console.log("hello");
  const user = await User.findById(req.user);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.status(200).json(user);
};



const handleForgetPassword = async (req, res) =>{
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ message: "please fill all details" });
    }
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res.status(404).json({ message: "Check ur Email" });
    }
    handleSendOtpVerification({res, email})
    return res.status(404).json({ message: "Check ur Email" });
  } catch (error) {
    console.log(error);
  }
}
 const handleforgetPassOtp = async (req, res) =>{
  const { email, otps } = req.body;
  try {
    if (!email || !otps) {
      return res.status(404).json({ message: "please fill all details" });
    }
    const userOtpVerificationRecord = await Otpmodel.find({ email });
    if (userOtpVerificationRecord.length <= 0) {
      return res.status(404).json({
        message:
          "Account Record not found or Already verify, Sign up or log in",
      });
    }
    console.log(userOtpVerificationRecord);
    const { createdAt, expiresAt } = userOtpVerificationRecord[0];
    const hashOtp = userOtpVerificationRecord[0].otps;
    console.log(expiresAt, "here");

    if (expiresAt < Date.now()) {
      await Otpmodel.deleteMany({ email });
      return res
        .status(200)
        .json({ message: "otp expire, request for another one" });
    }
    const isMatch = await bcrypt.compare(otps, hashOtp);
    if (!isMatch) {
      return res.status(404).json({ message: "invalid Otp check your mail" });
    }

    if(isMatch){
      await Otpmodel.deleteMany({ email });
      return res.status(200).json({ message: "otp verified" });
    }

    res.json("hello");
  } catch (error) {
    res.json(error);
    console.log(error);
  }
 }

 const handleChangePassword = async (req, res) =>{
  try {
    const { email , newPassword } = req.body
  const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res.status(404).json({ message: "Check ur Email" });
    }
    const salt = await bcrypt.genSalt();
    updatedPassword = await bcrypt.hash(newPassword, salt);
    await User.updateOne({email}, {password :  updatedPassword})
    return res.status(200).json({ message: "password changed" });

  } catch (error) {
    console.log(error);
  }



 }
module.exports = {
  handleSignUp,
  handleOtpverify,
  handleCheckAuth,
  handleLogIn,
  handleForgetPassword,
  handleforgetPassOtp, 
  handleChangePassword
};