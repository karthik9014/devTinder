const express = require('express');
const { authenticateUser } = require('../middlewares/auth');
const { validateSendRequestData, validateRequestReviewData } = require('../utils/validator');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', authenticateUser, async (req, res) => {
    try {
        // Validate send request data
        validateSendRequestData(req);
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;
        // Check if the connection request already exists
        const existingRecords = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        // Check if the toUserId exists in the database, then only send the request
        const isUserExists = await User.findOne({ _id: toUserId });
        if (existingRecords) {
            throw new Error(`Not Allowed, connection request already exits`);
        } else if (!isUserExists) {
            throw new Error(`User does not exists`);
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        await connectionRequest.save();

        res.status(200).json({ message: `${req.user.firstName} sent the request successfully`, isSuccess: true });
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

requestRouter.post('/request/review/:status/:requestId', authenticateUser, async (req, res) => {
    try {
        //validate the request Data
        validateRequestReviewData(req);
        const { requestId, status } = req.params;
        const loggedInUserId = req.user._id;

        const record = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUserId,
            status: 'interested',
        });
        if (!record) {
            throw new Error(`Connection Request does not exists`);
        } else {
            record.status = status;
            await record.save();
            res.status(200).json({ message: `Connection request ${status} successfully`, isSuccess: true });
        }
    } catch (error) {
        res.status(500).json({ message: `Error : ${error.message}`, isSuccess: false });
    }
});

module.exports = requestRouter;
