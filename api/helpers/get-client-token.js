var request = require('request');

module.exports = () => {
    return new Promise((resolve, reject) => {
        var postQuery = 'grant_type=client_credentials';

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
                resolve(JSON.parse(data));
            } else {
                reject(error)
            }
            });
    })
  
}