require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body["access_token"]);
    // Now that access token is set, you can make API requests
    return spotifyApi.searchArtists("Artist Name"); // Replace 'Artist Name' with the actual artist name you want to search for
  })
  .then((data) => {
    console.log("The received data from the API: ", data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch((err) =>
    console.log("The error while searching artists occurred: ", err)
  );

// Our routes go here:
app.get("/artist-search", (req, res) => {
  const query = req.query.q;
  console.log(query);

  spotifyApi.searchArtists(query).then((data) => {
    console.log("The received data from the API: ", data.body.artists.items);
    const artists = data.body.artists.items;
    res.render("artist-search-results", { artists });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
