const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const cohortEnum = {
    values: ['16', '17', '18', '19', '20', '21'],
    message: 'Invalid Cohort, Must be one of 16, 17, 18, 19, 20, 21'
};

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    cohort: {type: String, enum: cohortEnum, required: true},
    password: {type: String, required: true}
})

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            next();
        } catch (err) {
            return next(err);
        }
    } else {
        return next();
    }
});

const User = mongoose.model('User', userSchema);
module.exports = {User, cohortEnum};
