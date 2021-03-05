// const createInsightDoc = require('../helpers/create-insights-doc')
const keyInsight = require('../models/insights');
const track = require('../models/tracks');
const findInsights = require('../helpers/find-insights');
module.exports = (req, res, next) => {
    console.log('asdasddas25')
    track.count({}, function(err, count){

        keyInsight.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, doc) {
            if(err) {
                console.log(err)
            }
            findInsights(count)
            // if(doc.total_song_count - count > 500) {
            //     //Time to run through tracks and pull out new insights
            //     findInsights(count)
            // }
            next();
            
        });
    })

    //check if neccesary to run through data and pull out data
    

      
}