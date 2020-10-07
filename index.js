var express = require("express");
var app = express();
var path = require('path');
var cors = require('cors')
var bodyParser = require('body-parser');
var request = require('request');
let port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json())
// let baseUrl = "https://spotifyplaylistcreator.herokuapp.com"
let baseUrl = "http://localhost:5000"
app.get('/auth', function (req, res) {
  res.send("this is a test")
  // var scopes = 'user-library-read playlist-modify-public playlist-modify-private user-read-email';
  // var my_client_id = 'cefa8cc2bdd94621be08b7ba3a4b4142';
  // var redirect_uri = baseUrl + '/token'
  // res.redirect('https://accounts.spotify.com/authorize' +
  //   '?response_type=code' +
  //   '&client_id=' + my_client_id +
  //   (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
  //   '&redirect_uri=' + encodeURIComponent(redirect_uri));
});



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/tokenpage.html'));
});


app.get('/token', function (req, res) {
  res.sendFile(path.join(__dirname + '/tokenpage.html'));
});



app.post('/tokencode', function (req, res) {
  const code = req.body.code
  var redirect_uri = baseUrl + '/token'

  var postQuery = 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirect_uri + '';
  console.log(postQuery)
  request({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      'Authorization': 'Basic Y2VmYThjYzJiZGQ5NDYyMWJlMDhiN2JhM2E0YjQxNDI6MDY1ZmNkMzZlZjljNGM3Mjg0ZWM4ZGU0MWZmZjk2MTM=',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postQuery.length
    },
    body: postQuery
  }, function (error, response, data) {
    //send the access token back to client
    if (!error) {
      console.log(data)
      res.status(200).json({
        data: JSON.parse(data)
      });
    } else {
      console.log(error)
    }
  });

});


app.listen(port, () => {
  console.log("Server running on port " + port);
});