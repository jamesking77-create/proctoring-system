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

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token has expired' });
        }

        req.user = decoded;
        next(); 

    } catch (error) {
        console.error(error);

        if (error instanceof jwt.JsonWebTokenError) {
            // Invalid token format or signature
            console.error('Invalid token format or signature:', error.message);
            return res.status(401).json({ message: 'Invalid token format or signature' });
        } else if (error instanceof jwt.TokenExpiredError) {
            // Token has expired
            console.error('Token has expired:', error.message);
            return res.status(401).json({ message: 'Token has expired' });
        } else {
            // Other errors
            console.error('Error verifying token:', error.message);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}
 module.exports = {
    authenticateToken,
};
