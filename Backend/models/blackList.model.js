const mongoose = require('mongoose');
const { createIndexes } = require('../models/user.model');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24
    }
});

module.exports = mongoose.model('blacklistToken', blacklistTokenSchema);