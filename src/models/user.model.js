const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, minLength: 3, maxLength: 50, trim: true, required: true },
        lastName: { type: String, minLength: 3, maxLength: 50, trim: true, required: true },
        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            // select: false,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error('Password is not strong enough');
                }
            },
        },
        age: { type: Number, min: 18 },
        gender: {
            type: String,
            validate(value) {
                if (!['male', 'female', 'others'].includes(value?.toLowerCase())) {
                    throw new Error('Invalid gender');
                }
            },
        },
        photoUrl: {
            type: String,
            default: 'https://th.bing.com/th/id/OIP.7O4_GREtLbxqPdJCTmfatQHaHa?rs=1&pid=ImgDetMain',
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error('Invalid URL');
                }
            },
        },
        about: { type: String },
        skills: { type: [String] },
    },
    { timestamps: true }
);
UserSchema.methods.getJwt = function () {
    const { _id } = this;
    const token = jwt.sign({ _id: _id }, 'secret', { expiresIn: '1d' });
    return token;
};
UserSchema.methods.isPasswordValid = async function (passwordEnteredByUser) {
    const isPasswordValid = await bcryptjs.compare(passwordEnteredByUser, this.password);
    return isPasswordValid;
};

module.exports = mongoose.model('User', UserSchema);
