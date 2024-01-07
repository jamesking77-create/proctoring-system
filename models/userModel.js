const mongoose = require('mongoose');
const argon2 = require('argon2');

const cohortList = {
    values: ['16', '17', '18', '19', '20', '21'],
    message: 'COHORT_EXCEPTION',
};
const COHORT_EXCEPTION = 'Invalid Cohort, Must be one of 16, 17, 18, 19, 20, 21';

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    cohort: {type: String, enum: cohortList, required: true},
    password: {type: String, required: true}
})

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) { 
        try {
            const hashedPassword = await argon2.hash(user.password);
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
module.exports = {User, cohortList, COHORT_EXCEPTION};
