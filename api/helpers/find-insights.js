const Track = require('../models/tracks');
const Insight = require('../models/insights');
module.exports = (count) => {
// Loop through tracks and create dictionaries of data listed in Notion
    console.log("req.count: " + count);

    let insight_doc = new Insight({
        total_number_songs: count,
        pop_song: {}
    })
    
    Track.find({} , (err, tracks) => {
        if(err) {
            console.log(err)
        }

        tracks.map((track, index) => {
            console.log(index, track.song_name);
            
            //find most popular song
        })

        console.log(insight_doc)
    })


//When done with dictionaries send to helper function Create-insights-document
}