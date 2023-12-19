const {User, cohortEnum} = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res, next) => {
    try {
        const {username, password, cohort} = req.body;
        if (!username || !password || !cohort) {
            return res.status(400).json({message: 'Please provided all required fields'});
        }
        if (!cohortEnum.values.includes(cohort)) {
            return res.status(400).json({message: 'Invalid Cohort. Must be one of: 16, 17, 18, 19, 10, 21'});
        }

        const existingUser = await User.findOne({$or: [{username}]});
        if (existingUser) {
            return res.status(409).json({message: 'User with this username already exists'});
        }

        const newUser = new User({username, password, cohort});
        await newUser.save();

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        return res
            .status(201)
            .header('Authorization', 'Bearer' + token)
            .json({message: 'User registered successfully.'});
    } catch (err) {
        return next(err);
    }
};