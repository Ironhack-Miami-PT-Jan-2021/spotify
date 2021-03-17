require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
var SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:/callback'
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res, next)=>{

    res.render('index');

});


app.get('/artist-search', (req, res, next)=>{
    let artistName = req.query.artist;
    spotifyApi
    .searchArtists(artistName)
    .then(data => {
        let results = data.body.artists.items
        res.render('artist-search', {artists: results});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/artist-albums/:theid', (req, res, next)=>{
    spotifyApi.getArtistAlbums(req.params.theid).then(
        function(data) {
          let results = data.body.items


        const uniqueAlbums = Array.from(new Set(results.map(a => a.name)))
        .map(name => {
        return results.find(a => a.name === name)
    })
    res.render('albums', {albums: uniqueAlbums})
        },
        function(err) {
          console.error(err);
        }
      );
})

app.get('/tracks/:albumid', (req, res, next)=>{
    let id = req.params.albumid;
    spotifyApi.getAlbumTracks(id, { limit : 5})
    .then(function(data) {
        let results = data.body.items;
        res.render('tracks', {tracks: results})

    }, function(err) {
        console.log('Something went wrong!', err);
    });
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
