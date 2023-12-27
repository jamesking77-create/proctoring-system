const express = require("express");
const authControllers = require("../controllers/authControllers");
const {authenticateToken} = require("../middleware/authentication");
const router = express.Router();


router.post("/register", authControllers.registerUser);
router.post("/login", authControllers.login);

router.get("/protected-resource", authenticateToken, (req, res) => {
    res.json({message: "Access granted to protected resource"});
});

module.exports = router;