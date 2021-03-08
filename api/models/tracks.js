const mongoose = require('mongoose');

const trackSchema = mongoose.Schema(
    {
        added_at: [{ type: String }],
        artists: [{id: String, name: String}],
        duration_ms: {type: Number},
        isrc: {type: String},
        song_id: {type: String, unique: true, required: true, dropDups: true},
        song_name: {type: String},
        popularity: {type: Number},
        album_id: {type: String},
        frequency: {type: Number, default: 1},
        release_date: {type: String},
        genres: []
    }
);

module.exports = mongoose.model('trackSchema', trackSchema);
