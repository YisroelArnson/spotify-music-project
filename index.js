require('dotenv').config();
var express = require("express");
var app = express();
var path = require('path');
var cors = require('cors')
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
let port = process.env.PORT || 5000;

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);


app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.static("public"))

const authRoutes = require('./api/routes/auth');
const playlistRoutes = require('./api/routes/playlist');
const tracksRoutes = require('./api/routes/track');
const insightsRoutes = require('./api/routes/insight');


app.use('/auth', authRoutes);
app.use('/playlist', playlistRoutes);
app.use('/tracks', tracksRoutes)
app.use('/insights', insightsRoutes)


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})


app.listen(port, () => {
  console.log("Server running on port " + port);
});
