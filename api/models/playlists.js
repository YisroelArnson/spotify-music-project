const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        playlist: {type: Object}
    },
    {
        timestamps: { createdAt: 'created_at' }
    }
);

module.exports = mongoose.model('playlistSchema', playlistSchema);
