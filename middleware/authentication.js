const jwt = require('jsonwebtoken');
require("dotenv").config();

function authenticateToken(req, res, next) {
    const token = req.header('Authorization').trim();

    if (!token) {
        return res.status(401).json({message: 'Access denied - No token provided'});
    }
    console.log("Received Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded token:", decoded);

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({message: 'Token has expired'});
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Token has expired'});
        }
        res.status(401).json({message: 'Invalid token'});
    }
}

module.exports = {
    authenticateToken,
};
