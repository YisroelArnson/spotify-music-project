// const createInsightDoc = require('../helpers/create-insights-doc')
const keyInsight = require("../models/insights");
const track = require("../models/tracks");
const findInsights = require("../helpers/find-insights");

module.exports = async (req, res, next) => {
  try {
    console.log("Checking if new insights are required...");

    // Use await with countDocuments()
    const count = await track.countDocuments({});
    console.log(`Count of tracks: ${count}`);

    // Use await with findOne()
    const doc = await keyInsight.findOne({}, {}, { sort: { created_at: -1 } });

    findInsights(count);

    next();
  } catch (err) {
    console.error("Error processing insights:", err);
    next(err); // Pass the error to the next middleware
  }
};

// module.exports = (req, res, next) => {
//   console.log("Checking if new insights are required...");
//   track.countDocuments({}, function (err, count) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(`Count of tracks: ${count}`);
//     keyInsight.findOne(
//       {},
//       {},
//       { sort: { created_at: -1 } },
//       function (err, doc) {
//         if (err) {
//           console.log(err);
//         }
//         // console.log("The difference is: " + (doc.total_song_count - count))

//         // //check if neccesary to run through data and pull out data
//         // if(count - doc.total_song_count  > 500) {
//         //     console.log('New insights required...')
//         //     //Time to run through tracks and pull out new insights
//         findInsights(count);
//         // } else {
//         //     console.log('New insights are not required...')
//         //     console.log('Adding new Tracks to trackSchema...')
//         //     console.log('===================================')
//         // }
//         next();
//       }
//     );
//   });
// };
