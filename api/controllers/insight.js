var mongoose = require('mongoose')
var Insight = require('../models/insights')

exports.fetch_insight = (req, res) => {
    Insight.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, insight) {
        if(err) {
            console.log(err)
            res.status(400).json({
                err: err
            })
        }
        res.status(200).send(insight)
    });
}