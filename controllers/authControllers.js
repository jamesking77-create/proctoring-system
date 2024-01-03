const {User, cohortList} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
require("dotenv").config();
const authenticateToken = require("../middleware/authentication");

const registerUser = async (req, res, next) => {
    try {
        const {username, password, cohort} = req.body;
        if (!username || !password || !cohort) {
            return res
                .status(400)
                .json({message: "Please provide all required fields"});
        }
        if (!cohortList.values.includes(cohort)) {
            return res.status(400).json({
                message: "Invalid Cohort. Must be one of: 16, 17, 18, 19, 21",
            });
        }

        const existingUser = await User.findOne({$or: [{username}]}).maxTimeMS(
            20000
        );
        if (existingUser) {
            return res
                .status(409)
                .json({message: "User with this username already exists"});
        }

        const newUser = new User({username, password, cohort});
        await newUser.save();
        return res.status(201).json({message: "User registered successfully."});
    } catch (err) {
        return next(err);
    }
};

const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const storedUser = await getUserFromDatabase(username);
        const comparePassword = await comparePasswords(password, storedUser.password)
        if (comparePassword && storedUser) {
            const token = jwt.sign({userId: storedUser._id}, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            //res.header("Authorization", "Bearer " + token);
            res.json({message: "Login successful", token: "Bearer " + token});
        } else {
            res.status(401).json({message: "Invalid username or password"});


            const comparePassword = await comparePasswords(
                password,
                storedUser.password
            );

            if (comparePassword) {
                const token = jwt.sign(
                    {userId: storedUser._id},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );

                res.header('Authorization', token);
                console.log("sent token", req.get("Authorization"))
                res.json({message: "Login successful"});
            } else {
                res.status(401).json({message: "Invalid username or password"});
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "An error occurred during login"});
    }
};

async function getUserFromDatabase(username) {
    try {
        const user = await User.findOne({username});

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

const protectedResource = (req, res) => {
    res.json({message: "Access granted to protected resource"});
};

module.exports = {
    registerUser,
    login,
    protectedResource,
};
