const jwt = require('jsonwebtoken')


const verifyToken = (req, res , next) =>{
    
    const header = req.headers.authorization
    if (!header) {
        return res.status(401).json({ message: "unauthorized" });
    }
    const token = header.split(" ")[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(404).json("your token expire pls login");
        console.log(decoded);
        req.user = decoded.id;
        next();
      });
}



module.exports = { verifyToken };