var mongoose = require('mongoose')
const Track = require('../models/tracks');
const Insight = require('../models/insights');
module.exports = (count) => {
// Loop through tracks and create dictionaries of data listed in Notion
    console.log("Finding insights...");

    let insight_doc = new Insight({
        _id: new mongoose.Types.ObjectId(),
        total_song_count: count,
        pop_song: {},
        pop_artists: {}

    })
    
    let artist_dict = {}
    let category_dict = {}
    let year_dict = {}
    let largest_frequency = 0;
    

    Track.find({} , (err, tracks) => {
        if(err) {
            console.log(err)
        }

        tracks.map((track, index) => {
            
            //find most popular song with frequency attribute
            if(track.frequency > largest_frequency) {
                largest_frequency = track.frequency
                insight_doc.pop_song = track
            }

            //create dictionary of artists
            for(let i = 0; i < Object.keys(track.artists).length; i++) {
                if(track.artists[i].id in artist_dict) {
                    artist_dict[track.artists[i].id] = artist_dict[track.artists[i].id] + 1;
                }
                else {
                    artist_dict[track.artists[i].id] = 1
                }
            }
        })
        console.log(artist_dict)
        //find most popular artists
        const getMax = object => {
            return Object.keys(object).filter(x => {
                 return object[x] == Math.max.apply(null, 
                 Object.values(object));
           });
        };

        let most_pop_artists_arr = getMax(artist_dict)
        insight_doc.pop_artists = most_pop_artists_arr
        console.log('New insights saved...')
        insight_doc.save()
    })

    

//When done with dictionaries send to helper function Create-insights-document
}