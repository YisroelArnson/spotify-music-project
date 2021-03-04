const keyInsight = require('../models/insights');
const mongoose = require('mongoose');

module.exports = async () => {
    const insight = new keyInsight({
        _id: new mongoose.Types.ObjectId(),
        total_song_count: 1347
    })

    await keyInsight.create(insight, function(err, thing) {
        if(err) {
            console.log(err)
        } else {
            console.log(thing)
        }
    });
};