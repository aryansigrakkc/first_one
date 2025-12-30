const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel'); 
const authMiddleware = async (req, res, next) => {
  try {
    // Token ko headers se uthao
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ status: false, message: "No token provided" });
    }

  
    const decoded = jwt.verify(token, "this_is_my_secret_Key");

 
    req.user = decoded; 

    next(); 
  } catch (error) {
    console.log(error);
    return res.status(401).send({ status: false, message: "Invalid or expired token" });
  }
};


const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ status: false, message: "Admin access only" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
