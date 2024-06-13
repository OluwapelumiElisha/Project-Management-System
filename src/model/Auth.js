const mongoose = require('mongoose')
const { Schema } = mongoose

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };


const UserSchema = Schema({
    // name:{
    //     type: String,
    //     required: true
    // },
    userName: {
        type: String,
        required: true,
        unique: true
      },
    email: {
        type: String,
        required: "Email address is required",
        trim: true,
        unique: true,
        validate: [validateEmail, "Please fill a valid email address"],
        lowercase: true,
      },
    isEmailVerify:{
        type: Boolean,
        default : false
    },
    title:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
      },
      lastActive: { 
        type: Date, 
        default: Date.now 
      },
     
      image: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      projects: [
        {
          project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Projects",
          },
        },
      ],
})

module.exports = mongoose.model('User', UserSchema)