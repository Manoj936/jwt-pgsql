const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkAuthenticity = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (token) {
      const verification = await jwt.verify(token , process.env.secretKey);
      req.user = verification.user_id
      next();
    } else {
      res.status(403).json({ message: "token not found" });
    }
    
  } catch (e) {
    res.status(401).json({ message: "token is invalid" });
  }
};

module.exports = {checkAuthenticity};
