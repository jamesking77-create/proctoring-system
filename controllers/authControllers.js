const { User, cohortList } = require("../models/userModel");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = require("../utils/encryption");
require('../utils/privateConfig');
const secretKey = process.env.SECRET_KEY;

let regkey = null;
let logkey = null;

const getRegistrationKey = async (req, res) => {
  try {
    let key = secretKey
    console.log("this key 1:", key);
    regkey = key;
    return res.status(201).json(key);
  } catch (err) {
    return err;
  }
};

const getLoginKey = async (req, res) => {
  try {
    let pkey = secretKey
    console.log("this key 2:", pkey);
    logkey = pkey;
    return res.status(201).json(pkey);
  } catch (err) {
    return err;
  }
};

async function registerUser(req, res, next) {
    try {
        const { data } = req.body;
        const decryptedData = privateKey.decryptData(data, regkey);
        const { username, cohort, password } = JSON.parse(decryptedData);

        if (!username || !password || !cohort) {
            return res
                .status(400)
                .json({ message: "Please provide all required fields" });
        }
        if (!cohortList.values.includes(cohort)) {
            return res.status(400).json({
                message: "Invalid Cohort. Must be one of: 16, 17, 18, 19, 20",
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "User with this username already exists" });
        }
        const newUser = new User({ username, password, cohort });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        return next(err);
    }
}

async function login(req, res) {
    try {
        const { data } = req.body;
        const decryptedData = privateKey.decryptData(data, logkey);
        const { username, password } = JSON.parse(decryptedData);
        const storedUser = await getUserFromDatabase(username);
        const comparePassword = await comparePasswords(
            password,
            storedUser.password
        );
        if (comparePassword && storedUser) {
            const token = jwt.sign(
                { userId: storedUser._id },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            res.header("Authorization", "Bearer" + token);
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid username or password" });
    }
}

async function getUserFromDatabase(username) {
  try {
    const user = await User.findOne({ username });
    if (user) {
      return user;
    } else {
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

    const isMatch = await argon2.verify(storedPasswordHash, inputPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw error;
  }
}

const protectedResource = (req, res) => {
  res.json({ message: "Access granted to protected resource" });
};

module.exports = {
  registerUser,
  login,
  protectedResource,
  getRegistrationKey,
  getLoginKey,
};
