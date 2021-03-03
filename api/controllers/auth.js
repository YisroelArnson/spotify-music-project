var request = require('request');

exports.spotify_login = (req, res) => {
    var baseUrl;
    if(process.env.DEV == 'dev') {
        baseUrl = "http://localhost:5000"
    } else {
        baseUrl = "https://spotifyplaylistcreator.herokuapp.com"
    }

    var scopes = 'user-library-read playlist-modify-public playlist-modify-private user-read-email';
    var my_client_id = 'cefa8cc2bdd94621be08b7ba3a4b4142';
    var redirect_uri = baseUrl + '/playlist'
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
  }

exports.get_access_token = (req, res) => {
    var baseUrl;
    if(process.env.DEV == 'dev') {
        baseUrl = "http://localhost:5000"
    } else {
        baseUrl = "https://spotifyplaylistcreator.herokuapp.com"
    }

    const code = req.body.code
    var redirect_uri = baseUrl + '/playlist'

    var postQuery = 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirect_uri + '';
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
}