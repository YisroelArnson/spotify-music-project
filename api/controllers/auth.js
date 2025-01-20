var request = require("request");
var getClientToken = require("../helpers/get-client-token");

exports.spotify_login = (req, res) => {
  var baseUrl;
  if (process.env.DEV == "dev") {
    baseUrl = "http://localhost:5000";
  } else {
    baseUrl = "https://spotify-music-project.onrender.com";
  }

  var scopes =
    "user-library-read playlist-modify-public playlist-modify-private user-read-email";
  var my_client_id = "4686ec460b8448e580130748d74aea5e";
  var redirect_uri = baseUrl + "/playlist";
  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      my_client_id +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri)
  );
};

exports.get_access_token = (req, res) => {
  var baseUrl;
  if (process.env.DEV == "dev") {
    baseUrl = "http://localhost:5000";
  } else {
    baseUrl = "https://spotify-music-project.onrender.com";
  }
  var my_client_id = "4686ec460b8448e580130748d74aea5e";
  var client_secret = "2c19a4528faa48aeb111f86ae68ea9b1";
  const code = req.body.code;
  var redirect_uri = baseUrl + "/playlist";
  console.log(code);
  var postQuery =
    "grant_type=authorization_code&code=" +
    code +
    "&redirect_uri=" +
    redirect_uri +
    "";
  request(
    {
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(my_client_id + ":" + client_secret).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postQuery.length,
      },
      body: postQuery,
    },
    function (error, response, data) {
      //send the access token back to client
      if (!error) {
        console.log(data);
        res.status(200).json({
          data: JSON.parse(data),
        });
      } else {
        console.log(error);
      }
    }
  );
};

exports.get_fetch_access_token = async (req, res) => {
  const accessTokenData = await getClientToken();
  res.send(accessTokenData);
};
