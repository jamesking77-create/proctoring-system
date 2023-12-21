const jwt = require('jsonwebtoken');
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied - No token provided' });
  }

  try {
    const secretKey = process.env.JWT_SECRET; 
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded; 
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
  authenticateToken,
};

