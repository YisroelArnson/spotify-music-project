// const createInsightDoc = require('../helpers/create-insights-doc')
const keyInsight = require('../models/insights');
const track = require('../models/tracks');

module.exports = (req, res, next) => {

    track.count({}, function( err, count){
        console.log( "Number of users:", count );

        keyInsight.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, doc) {
            if(err) {
                console.log(err)
            }

            if(doc.total_song_count - count > 500) {
                //Time to run through tracks and pull out new insights
            }
            next();
            
        });
    })

    //check if neccesary to run through data and pull out data
    

      
}