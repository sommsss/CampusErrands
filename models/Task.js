const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    bounty: Number,

    // EXISTING lifecycle status (keep this)
    status: {
        type: String,
        enum: ['Open', 'Claimed', 'Completed'],
        default: 'Open'
    },

    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tasker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // 🆕 MODERATION LAYER
    moderationStatus: {
        type: String,
        enum: ['clean', 'flagged', 'removed'],
        default: 'clean'
    },

    flags: {
        selfHarm: { type: Boolean, default: false },
        violence: { type: Boolean, default: false },
        abusive: { type: Boolean, default: false },
        alcohol: { type: Boolean, default: false },
        confidence: { type: String, default: 'low' }
    }
});

module.exports = mongoose.model('Task', taskSchema);