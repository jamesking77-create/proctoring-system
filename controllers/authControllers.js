const { User, cohortList } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const CryptoJS = require('crypto-js');
const privateKey = require('../utils/encryption');

let regkey = null;
let logkey = null;


const getRegistrationKey = async (req, res) =>{
    try{
        let key= privateKey.generateRegRandomKey(32);
        regkey = key;  
        return res.status(201).json(key);
    }catch(err){
        return(err);
    }
};


const getLoginKey = async (req, res) =>{
    try{
        let pkey= privateKey.generateLogRandomKey(32);
        logkey = pkey;  
        return res.status(201).json(pkey);
    }catch(err){
        return(err);
    }
};

function decryptData(encryptedData, secretKey) {
    try {
        const key = CryptoJS.enc.Hex.parse(secretKey);
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}



const registerUser = async (req, res, next) => {
    try {
      
        const { data } = req.body;
        console.log("this is req body", req.body);
        console.log("this is private key:", regkey);
        const decryptedData = decryptData(data, regkey);
        console.log("this is the decryption:", decryptedData);
        const { username, cohort, password } = JSON.parse(decryptedData);
        console.log("this is the data:", username, cohort, password );

        if (!username || !password || !cohort) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        if (!cohortList.values.includes(cohort)) {
            return res.status(400).json({
                message: "Invalid Cohort. Must be one of: 16, 17, 18, 19, 20",
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User with this username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, cohort });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        return next(err);
    }
};


const login = async (req, res) => {
    try {
        const {data} = req.body;
        const decryptedData = decryptData(data, logkey);
        const { username,  password } = JSON.parse(decryptedData);
        console.log("this is the decrypted data:", username,  password );
        const storedUser = await getUserFromDatabase(username);
        const comparePassword = await comparePasswords(password, storedUser.password)
        if (comparePassword && storedUser) {
            const token = jwt.sign({userId: storedUser._id}, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            res.header("Authorization", "Bearer" + token);
            res.json({message: "Login successful"});
        } else {
            res.status(401).json({message: "Invalid username or password"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Invalid username or password"});

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
    res.json({ message: "Access granted to protected resource" });
};

module.exports = {
    registerUser,
    login,
    protectedResource,
    getRegistrationKey,
    getLoginKey,  
};
