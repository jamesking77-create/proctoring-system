const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
    const token = req.header('Authorization').trim();
    const authHeader = req.header("Authorization");
    console.log("received Token " + authHeader);

    if (!authHeader) {
        return res
            .status(401)
            .json({message: "Access denied - No token provided"});
    }

//   const [bearer, token] = authHeader.split(' ');

//   if (bearer !== 'Bearer' || !token) {
//     return res.status(401).json({ message: 'Invalid token format' });
//   }

    try {
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(authHeader, secretKey);

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({message: "Token has expired"});
        }
        console.log("Received Token:", token);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log("Decoded token:", decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);


            if (error instanceof jwt.TokenExpiredError) {
                console.error("Token has expired:", error.message);
                return res.status(401).json({message: "Token has expired"});
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.error("Invalid token format or signature:", error.message);
                return res
                    .status(401)
                    .json({message: "Invalid token format or signature"});
            } else {
                console.error("Error verifying token:", error.message);
                return res.status(401).json({message: "Invalid token"});
            }
        }
    }catch (e) {

    }
    module.exports = {
        authenticateToken,
    };
}
