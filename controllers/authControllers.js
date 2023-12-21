const { User, cohortEnum } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secureApiKey = process.env.SECURE_API_KEY;
const authenticateToken = require("../middleware/authentication");

const registerUser = async (req, res, next) => {
  try {

    const { username, password, cohort } = req.body;
    if (!username || !password || !cohort) {
      return res
        .status(400)
        .json({ message: "Please provided all required fields" });
    }
    if (!cohortEnum.values.includes(cohort)) {
      return res.status(400).json({
        message: "Invalid Cohort. Must be one of: 16, 17, 18, 19, 10, 21",
      });
    }

    const existingUser = await User.findOne({ $or: [{ username }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this username already exists" });
    }

    const newUser = new User({ username, password, cohort });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
     
    });
    authenticateToken.authenticateToken(req, res);
    return res
      .status(201)
      .header("Authorization", "Bearer" + token)
      .json({ message: "User registered successfully." });

  } catch (err) {
    return next(err);
  }
};

const login = (req, res) => {
  try {
    const { username, password } = req.body;
    const storedUser = getUserFromDatabase(username);
    if (storedUser && comparePasswords(password, storedUser.password)) {
      console.log(
        ` Successful login for user: ${username},Date:[${new Date().toISOString()}]`
      );
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An Error Occured" });

  }
}

async function getUserFromDatabase(username) {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    console.error("Error fetching user from the database:", error);
    throw error
  }
}

async function comparePasswords(inputPassword, storedPasswordHash) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, storedPasswordHash);

    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
}

module.exports = {
    registerUser,
  login
};
