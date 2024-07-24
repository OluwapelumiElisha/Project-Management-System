// const mongoose = require('mongoose')
const Feedback = require("../model/Feedback");
const handleFeedBack = async(req, res) =>{
    // console.log(req.body)
    const user = req.user; 
    console.log(user.id );
    const { feedback, textfield } = req.body;

    if (!feedback || !textfield) {
        return res.status(400).json({ message: "Please provide Feedback..." });
    }

    try {
        const response = await Feedback.create({ feedback, textfield, user: user.id });
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
}






module.exports = { handleFeedBack };