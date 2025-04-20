const mongoose = require('mongoose');
const { CONNECTION_STATUSES } = require('../constants/types');

const ConnectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        toUserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        status: { type: String, required: true, enum: { values: CONNECTION_STATUSES.TYPES, message: `{VALUE} is incorrect status type` } },
    },
    {
        timestamps: true,
    }
);
// Adding index
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
ConnectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error(`Not Allowed, Cannot send connection request to yourself`);
    }
    next();
});
const ConnectionRequestModel = mongoose.model('ConnectionRequest', ConnectionRequestSchema);

module.exports = ConnectionRequestModel;
