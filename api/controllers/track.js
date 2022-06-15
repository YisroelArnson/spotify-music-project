var mongoose = require('mongoose')
const Playlist = require('../models/playlists');
const Track = require('../models/tracks');
var getClientToken = require('../helpers/get-client-token');
var request = require('request');

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

exports.add_tracks = async (req, res) => {
    console.log('made it to track.js add_tracks')
    const playlist = req.body;
    const accessTokenData = await getClientToken()
    for(let i = 0; i < playlist.length; i++) {
        let song_temp = playlist[i];
        let artists_array = []
        
        for(let k = 0; k < Object.keys(song_temp.track.artists).length; k++) {
            artists_array.push({id: song_temp.track.artists[k].id, name: song_temp.track.artists[k].name})
        }

        //Query spotify API to search for more information on a song.
        //Spotify reference: Search for an Item

        if(song_temp) {
            Track.findOne({song_id: song_temp.track.id}, function(err, result) {
                try {
                    if(!result) {
                        request({
                            url: "https://api.spotify.com/v1/artists/" + artists_array[0].id,
                            method: "GET",
                            headers: {
                                'Authorization': 'Bearer ' + accessTokenData.access_token,
                            }
                            }, function (error, response, data) {
                            if (!error) {
                                var parsedData = JSON.parse(data); 

                                const track = new Track({   
                                    added_at: song_temp.added_at,
                                    artists: artists_array,
                                    duration_ms: song_temp.track.duration_ms,
                                    isrc: song_temp.track.external_ids.isrc,
                                    song_id: song_temp.track.id,
                                    song_name: song_temp.track.name,
                                    popularity: song_temp.track.popularity,
                                    album_id: song_temp.track.album.id,
                                    release_date: song_temp.track.album.release_date,
                                    genres: parsedData.genres,
                                    album_images: song_temp.track.album.images
                                })
                                track.save()
                            } else {
                                console.log('========+++++++++=+======== Error in request block')
                                console.log(i, song_temp.track.name)
                                console.log(error)
                            }
                            });

                       
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