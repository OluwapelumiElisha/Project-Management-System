const jwt = require('jsonwebtoken');
const User = require('../model/Auth');

const authenticate = async (req, res, next) => {
    const header = req.headers.authorization
    if (!header) {
        return res.status(401).json({ message: "unauthorized" });
    }
    const token = header.split(" ")[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;
