
var mongoose = require('mongoose')
const Playlist = require('../models/playlists');
const Track = require('../models/tracks');


exports.add_full_playlist = (req, res) => {
    console.log(Object.keys(req.body).length)
    const playlist = new Playlist({
        _id: new mongoose.Types.ObjectId(),
        playlist: req.body
    });

    playlist.save().then((response) => {
        res.status(200).json(response);
    }).catch((err) => {
        console.log(err)
        res.status(500).json({ error: err });
    });

}

exports.add_tracks = (req, res) => {
    const playlist = req.body;
    for(let i = 0; i < playlist.length; i++) {
        let song_temp = playlist[i];
        let artists_array = []
        
        for(let k = 0; k < Object.keys(song_temp.track.artists).length; k++) {
            artists_array.push({id: song_temp.track.artists[k].id, name: song_temp.track.artists[k].name})
        }

        if(song_temp) {
            Track.findOne({song_id: song_temp.track.id}, function(err, result) {
                try {
                    if(!result) {
                        const track = new Track({   
                            added_at: song_temp.added_at,
                            artists: artists_array,
                            duration_ms: song_temp.track.duration_ms,
                            isrc: song_temp.track.external_ids.isrc,
                            song_id: song_temp.track.id,
                            song_name: song_temp.track.name,
                            popularity: song_temp.track.popularity,
                            album_id: song_temp.track.album.id
                        })

                        track.save()
                    } else {
                        result.frequency += 1;
                        result.added_at.push(song_temp.added_at)
                        result.save()
                    }
                } catch (err) {
                    console.log(err)
                }
            })    
        }
    }
    res.status(200);

}