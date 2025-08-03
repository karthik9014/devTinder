const express = require('express');
const { authenticateUser } = require('../middlewares/auth.middleware');
const ConnectionRequest = require('../models/connectionRequest.model');
const User = require('../models/user.model');
const {ALLOWED_USER_SAFE_DATA} = require('../constants/types');
const userRouter = express.Router();


userRouter.get('/user/requests/recieved', authenticateUser, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId,
            status: 'interested',
        }).populate('fromUserId', ALLOWED_USER_SAFE_DATA.TYPES);
        res.status(200).json({ message: `Data fetched Successfully`, isSuccess: true, data: connectionRequests });
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

userRouter.get('/user/connections', authenticateUser, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId, status: 'accepted' },
                { toUserId: loggedInUserId, status: 'accepted' },
            ],
        })
            .populate('fromUserId', ALLOWED_USER_SAFE_DATA.TYPES)
            .populate('toUserId', ALLOWED_USER_SAFE_DATA.TYPES);
        const allConnections = connections.map((item) =>
            item.fromUserId._id.toString() === loggedInUserId.toString() ? item.toUserId : item.fromUserId
        );
        res.status(200).json({ message: `Data fetched Successfully`, isSuccess: true, data: allConnections });
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

userRouter.get('/user/feed', authenticateUser, async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.pageNumber || 1);
        const pageSize = parseInt(req.query.pageSize || 10);
        const skip = (pageNumber - 1) * pageSize;
        const limit = pageSize > 50 ? 50 : pageSize;
        const loggedInUserId = req.user._id;
        const requests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
        });
        const hideUserFromFeed = new Set();
        requests.forEach((item) => {
            hideUserFromFeed.add(item.fromUserId);
            hideUserFromFeed.add(item.toUserId);
        });
        const feedUsers = await User.find({
            $and: [{ _id: { $nin: Array.from(hideUserFromFeed) } }, { _id: { $ne: loggedInUserId } }],
        })
            .select(ALLOWED_USER_SAFE_DATA.TYPES)
            .skip(skip)
            .limit(limit);
        res.status(200).json({ message: `Data fetched successfully`, isSuccess: true, data: feedUsers });
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

module.exports = userRouter;
