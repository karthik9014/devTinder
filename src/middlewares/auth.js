const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const authenticateUser = async(req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const decoded = jwt.verify(token, 'secret');
        const {emailId} = decoded;
        const user = await UserModel.findOne({ emailId });
        if (!user) {
            return res.status(401).send('Unauthorized');
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};

module.exports = { authenticateUser };
