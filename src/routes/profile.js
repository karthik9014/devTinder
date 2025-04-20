const express = require('express');
const { authenticateUser } = require('../middlewares/auth');
const { validateProfileEditData, validatePasswordUpdateData } = require('../utils/validator');
const UserModel = require('../models/user');
const bcryptjs = require('bcryptjs');
const profileRouter = express.Router();

profileRouter.get('/profile/view', authenticateUser, async (req, res) => {
    try {
        res.status(200).json({ message: ``, isSuccess: true, data: req.user });
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

profileRouter.patch('/profile/edit', authenticateUser, async (req, res) => {
    try {
        // validate Data
        if (!validateProfileEditData(req)) {
            throw new Error('Something went wrong');
        } else {
            const loggedInUser = req.user;
            Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
            await loggedInUser.save();
            res.status(200).json({ message: `${loggedInUser.firstName}, your profile is updated successfully`, isSuccess: true });
        }
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

profileRouter.post('/profile/password/update', async (req, res) => {
    try {
        if (validatePasswordUpdateData(req)) {
            const { emailId, newPassword } = req.body;
            const user = await UserModel.findOne({ emailId });
            if (user) {
                const isSame = await bcryptjs.compare(newPassword, user.password);
                if (isSame) throw new Error('New and Old password are same');
                const newPasswordHash = await bcryptjs.hash(newPassword, 10);
                user.password = newPasswordHash;
                await user.save();
                res.status(200).json({ message: `Password updated successfully`, isSuccess: true });
            } else {
                throw new Error('User does not exists');
            }
        } else {
            throw new Error('Something went wrong');
        }
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

module.exports = profileRouter;
