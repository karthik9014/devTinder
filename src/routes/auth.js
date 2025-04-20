const express = require('express');
const bcryptjs = require('bcryptjs');
const { validateSignupData, validateLoginData } = require('../utils/validator');
const UserModel = require('../models/user');
const { ALLOWED_USER_SAFE_DATA } = require('../constants/types');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        // validate data
        validateSignupData(req);
        // decrypt password
        const passwordHash = await bcryptjs.hash(password, 10);
        // Creating instance of model
        const user = new UserModel({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        const response = await user.save();
        //create jwt
        const token = user.getJwt();
        //set it in a cookie and send
        res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) });
        res.status(200).json({ message: 'User Saved Successfully!!!', isSuccess: true, data: response });
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

authRouter.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        //validate emailId
        validateLoginData(req);
        const user = await UserModel.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid Credentials');
        }
        if (await user.isPasswordValid(password)) {
            //create jwt
            const token = user.getJwt();
            //set it in a cookie and send
            res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) });
            res.status(200).json({ message: 'Login Successful', isSuccess: true, data: user });
        } else {
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

authRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout Successful', isSuccess: true });
});

module.exports = authRouter;
