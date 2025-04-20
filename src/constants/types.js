export const CONNECTION_STATUSES = Object.freeze({
    TYPES: ['interested', 'ignored', 'accepted', 'rejected'],
});
export const ALLOWED_EDIT_FIELDS_FOR_PROFILE = Object.freeze({
    TYPES: ['firstName', 'lastName', 'about', 'age', 'gender', 'photoUrl', 'skills'],
});
export const ALLOWED_FIELDS_FOR_PASSWORD_UPDATE = Object.freeze({
    TYPES: ['emailId', 'newPassword'],
});
export const ALLOWED_FIELDS_FOR_SEND_REQUEST = Object.freeze({
    TYPES: ['interested', 'ignored'],
});
export const ALLOWED_FIELDS_FOR_REVIEW_REQUEST = Object.freeze({
    TYPES: ['accepted', 'rejected'],
});
export const ALLOWED_USER_SAFE_DATA = Object.freeze({
    TYPES: ['_id', 'firstName', 'lastName', 'photoUrl', 'emailId', 'skills','about']
});
