const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: 'Untitled',
    },
    description: {
        type: String,
        default: '',
    },
    fileUrl: {
        type: String,
        required: true,
    },
    album: {
        type: String,
        default: 'Default Album',
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Photo', PhotoSchema);
