const mongoose = require("mongoose");
const Track = require("../models/tracks");
const Playlist = require("../models/playlists");
const createInsightObj = require("../helpers/create-insights-doc");

module.exports = async (count) => {
  try {
    console.log("Finding insights...");

    const total_song_count = count;
    let total_playlist_count;
    let pop_song = {};
    const artist_dict = {};
    const genre_dict = {};
    const year_dict = {};
    let largest_frequency = 0;

    // Fetch all tracks
    const tracks = await Track.find({}); // No callback; returns a Promise.

    tracks.forEach((track) => {
      // Find the most popular song by frequency
      if (track.frequency > largest_frequency) {
        largest_frequency = track.frequency;
        pop_song = track;
      }

      // Create a dictionary of artists
      track.artists.forEach((artist) => {
        artist_dict[artist.id] = (artist_dict[artist.id] || 0) + 1;
      });

      // Create a dictionary of genres
      track.genres.forEach((genre) => {
        genre_dict[genre] = (genre_dict[genre] || 0) + 1;
      });

      // Create a dictionary of release years
      const releaseYear = track.release_date.split("-", 1)[0];
      year_dict[releaseYear] = (year_dict[releaseYear] || 0) + 1;
    });

    const pickHighest = (obj, num = 1) => {
      const sortedKeys = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
      const result = {};
      sortedKeys.slice(0, num).forEach((key) => {
        result[key] = obj[key];
      });
      return result;
    };

    // Count total playlists
    total_playlist_count = await Playlist.countDocuments({});

    console.log(`Total playlists: ${total_playlist_count}`);

    // Extract top insights
    const pop_artists = pickHighest(artist_dict, 10);
    const pop_genres = pickHighest(genre_dict, 10);
    const pop_year_release = pickHighest(year_dict, 12);

    // Save insights
    await createInsightObj(
      total_song_count,
      pop_song,
      pop_artists,
      pop_genres,
      pop_year_release,
      total_playlist_count
    );

    console.log("New insights saved...");
  } catch (err) {
    console.error("Error finding insights:", err);
  }
};

// var mongoose = require('mongoose')
// const Track = require('../models/tracks');
// const Playlist = require('../models/playlists');
// const createInsightObj = require('../helpers/create-insights-doc');
// module.exports = (count) => {
// // Loop through tracks and create dictionaries of data listed in Notion
//     console.log("Finding insights...");

//     var total_song_count = count;
//     var total_playlist_count;
//     var pop_song = {};
//     var pop_artists = {};
//     var pop_genres = {};
//     var pop_year_release = {};

//     let largest_frequency = 0;
//     let artist_dict = {}
//     let genre_dict = {}
//     let year_dict = {}

//     Track.find({} , (err, tracks) => {
//         if(err) {
//             console.log(err)
//         }

//         tracks.map((track, index) => {

//             //find most popular song with frequency attribute
//             if(track.frequency > largest_frequency) {
//                 largest_frequency = track.frequency
//                 pop_song = track
//             }

//             //create dictionary of artists
//             for(let i = 0; i < Object.keys(track.artists).length; i++) {
//                 if(track.artists[i].id in artist_dict) {
//                     artist_dict[track.artists[i].id] = artist_dict[track.artists[i].id] + 1;
//                 }
//                 else {
//                     artist_dict[track.artists[i].id] = 1
//                 }
//             }

//             //create dictionary for genres
//             for(let i = 0; i < track.genres.length; i++) {
//                 if(track.genres[i] in genre_dict) {
//                     genre_dict[track.genres[i]] = genre_dict[track.genres[i]] + 1;
//                 } else {
//                     genre_dict[track.genres[i]] = 1;
//                 }
//             }

//             //create dictionary for years
//             if(track.release_date.split("-",1) in year_dict) {
//                 year_dict[track.release_date.split("-",1)] = year_dict[track.release_date.split("-",1)] + 1;
//             } else {
//                 year_dict[track.release_date.split("-",1)] = 1;
//             }

//         })
//         const pickHighest = (obj, num = 1) => {
//             const requiredObj = {};
//             if(num > Object.keys(obj).length){
//                return false;
//             };
//             Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) =>
//             {
//                if(ind < num){
//                   requiredObj[key] = obj[key];
//                }
//             });
//             return requiredObj;
//         };

//         Playlist.count({}, function(err, playlistCount){
//             total_playlist_count = playlistCount;
//             console.log(playlistCount)

//             pop_artists = pickHighest(artist_dict, 10)
//             pop_genres = pickHighest(genre_dict, 10)
//             pop_year_release = pickHighest(year_dict, 12)

//             createInsightObj(total_song_count, pop_song, pop_artists, pop_genres, pop_year_release, total_playlist_count)

//             console.log('New insights saved...')
//         })

//     })
// }
