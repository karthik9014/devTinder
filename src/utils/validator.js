const validator = require('validator');
const { isValidObjectId } = require('mongoose');
const {
    ALLOWED_FIELDS_FOR_SEND_REQUEST,
    ALLOWED_EDIT_FIELDS_FOR_PROFILE,
    ALLOWED_FIELDS_FOR_PASSWORD_UPDATE,
    ALLOWED_FIELDS_FOR_REVIEW_REQUEST,
} = require('../constants/types');

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error('First name and last name are required');
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid');
    } else if (!validator.isStrongPassword(password)) {
        // validator.isAlpha('');
        throw new Error('Password is not strong enough');
    }
};
const validateLoginData = (req) => {
    const { emailId } = req.body;
    if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid');
    }
};
const validateProfileEditData = (req) => {
    const allowedEditFields = ALLOWED_EDIT_FIELDS_FOR_PROFILE.TYPES;

    const isEditAllowed = Object.keys(req?.body ?? {}).every((field) => allowedEditFields.includes(field));
    if (req.body?.skills?.length > 3) {
        throw new Error('Skills should not be more than three');
    }
    return isEditAllowed;
};

const validatePasswordUpdateData = (req) => {
    const allowedFields = ALLOWED_FIELDS_FOR_PASSWORD_UPDATE.TYPES;
    const isPasswordUpdateAllowed = Object.keys(req?.body ?? {}).every((field) => allowedFields.includes(field));
    if (!validator.isStrongPassword(req?.body?.newPassword)) {
        throw new Error('Password is not strong enough');
    }
    return isPasswordUpdateAllowed;
};

const validateSendRequestData = (req) => {
    const allowedStatuses = ALLOWED_FIELDS_FOR_SEND_REQUEST.TYPES;
    const { status, toUserId } = req.params;
    if (!allowedStatuses.includes(status)) {
        throw new Error(`Invalid status type, ${status}`);
    } else if (!isValidObjectId(toUserId)) {
        throw new Error(`Invalid user id, ${toUserId}`);
    }
};
const validateRequestReviewData = (req) => {
    const { requestId, status } = req.params;
    const allowedFields = ALLOWED_FIELDS_FOR_REVIEW_REQUEST.TYPES;
    if (!allowedFields.includes(status)) {
        throw new Error(`Invalid status type, ${status}`);
    } else if (!isValidObjectId(requestId)) {
        throw new Error(`Invalid user id, ${requestId}`);
    }
};

module.exports = {
    validateSignupData,
    validateLoginData,
    validateProfileEditData,
    validatePasswordUpdateData,
    validateSendRequestData,
    validateRequestReviewData,
};
