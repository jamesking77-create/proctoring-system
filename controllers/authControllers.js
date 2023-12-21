const { User, cohortList } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secureApiKey = process.env.SECURE_API_KEY;
const authenticateToken = require("../middleware/authentication");

<<<<<<< HEAD
exports.registerUser = async (req, res, next) => {
  try{

=======
const registerUser = async (req, res, next) => {
  try {
>>>>>>> b33562467e875c4c5cabbd64f7e0927d4f62de7c
    const { username, password, cohort } = req.body;
    if (!username || !password || !cohort) {
      return res
        .status(400)
        .json({ message: "Please provided all required fields" });
    }
    if (!cohortList.values.includes(cohort)) {
      return res.status(400).json({
        message: "Invalid Cohort. Must be one of: 16, 17, 18, 19, 21",
      });
    }

    const existingUser = await User.findOne({ $or: [{ username }] }).maxTimeMS(
      20000
    );
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this username already exists" });
    }

    const newUser = new User({ username, password, cohort });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "user info", { // process.env.JWT_SECRET is empty need to parse in secret key for user 
      expiresIn: "1h",
    });
    return res
      .status(201)
      .header("Authorization", "Bearer" + token)
      .json({ message: "User registered successfully." });
  } catch (err) {
    return next(err);
  }
};

const login =async (req, res) => {
  try {
    const { username, password } = req.body;
    const storedUser = await getUserFromDatabase(username);
    const comparePassword = await comparePasswords(password, storedUser.password)
    if (comparePassword && storedUser) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An Error Occured" });
  }
};

async function getUserFromDatabase(username) {
  try {

    const user = await User.findOne({ username });

    if (user) {
      return user;
    } else {
      console.log("User not found");
      return error;
    }
  } catch (error) {
    console.error("Error fetching user from the database:", error);
    throw error;
  }
}

async function comparePasswords(inputPassword, storedPasswordHash) {
  try {
    if (!inputPassword || !storedPasswordHash) {
        throw new Error("Both inputPassword and storedPassword are required");
      }

    const isMatch = await bcrypt.compare(inputPassword, storedPasswordHash);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
}

module.exports = {
  registerUser,
  login,
};
