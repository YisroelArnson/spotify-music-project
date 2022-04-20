const keyInsight = require('../models/insights');
const mongoose = require('mongoose');

module.exports = async (total_song_count, pop_song, pop_artists, pop_genres, pop_year_release, total_playlist_count) => {
    const insight = new keyInsight({
        _id: new mongoose.Types.ObjectId(),
        pop_song: pop_song,
        pop_artists: pop_artists,
        pop_genres: pop_genres,
        pop_year_release: pop_year_release,
        total_song_count: total_song_count,
        total_playlist_count: total_playlist_count
    })

    // insight.save()

    await keyInsight.create(insight, function(err, thing) {
        if(err) {
            console.log(err)
        } else {
            console.log(thing)
        }
    });
};