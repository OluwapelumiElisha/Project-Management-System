// middleware/updateLastActive.js
const User = require('../model/Auth');

const updateLastActive = async (req, res, next) => {
    if (req.user) {
        try {
            await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });
        } catch (err) {
            console.error('Error updating last active time:', err);
        }
    }
    next();
};

module.exports = updateLastActive;
