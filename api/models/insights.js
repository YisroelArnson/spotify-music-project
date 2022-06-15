const mongoose = require('mongoose');
//pop is short for most popular
const keyInsight = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        pop_song: {type: Object},
        pop_artists: {type: Object},
        pop_genres: {type: Object},
        pop_year_release: {type: Object},
        total_song_count: {type: Number},
        total_playlist_count: {type: Number}
    },
    {
        timestamps: { createdAt: 'created_at' }
    }
);

module.exports = mongoose.model('insightSchema', keyInsight);
