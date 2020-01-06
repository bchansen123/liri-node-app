//Packages required for running the JS file

require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var moment = require("moment");
//Gloablly stored keys
var spotify = new Spotify(keys.spotify);
//Global variables to use further in code
var search = process.argv.slice(3).join("+");
var bandURL = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
var omdbURL = "http://www.omdbapi.com/?t=" + search + "&apikey=trilogy";
var liriChoice = process.argv[2];

//concert search
function concertSearch() {
//Error handler if no artist is input
    if (!search) {
    console.log("Please enter an artist");
    return;
    };
    axios.get(bandURL)
    .then(function (bandData) {
        var venueInfo = bandData.data[0];
        var d = moment(venueInfo.datetime).format("MM-DD-YYYY");
        
        // console.log(venueInfo);
        var venueData = [
            "Venue: " + venueInfo.venue.name,
            "Location: " + venueInfo.venue.city + ", " + venueInfo.venue.region,
            "Date: " + d
        ].join("\n\n");
        console.log(venueData);            
    });
};


//spotify search
function spotifySearch() {
//Error handler if no song
    if (!search) {
        search = "The Sign, Ace of Base";
        return;
    };

    spotify.search({ type: 'track', query: search }, function(err, spotifyData) {
        if (err) {
        return console.log('Error occurred: ' + err);
        };
        var trackData = spotifyData.tracks.items[0]
    // console.log(trackData);
    var songData = [
        "Artist: " + trackData.artists[0].name,
        "Song Name: " + trackData.name,
        "Preview Link: " + trackData.preview_url,
        "Album: " + trackData.album.name
    ].join("\n\n");
    console.log(songData);
    });
};

//OMDB Search
function ombdSearch() {
    if (!search) {
        search = "Mr+Nobody";
        return;
    };
    //Call out to OMDB database to retrieve movie information
    axios.get(omdbURL)
    .then(function(omdbData) {
        var movieInfo = omdbData.data;
        var movie = [
            "Title: " + movieInfo.Title,
            "Year: " + movieInfo.Year,
            "Rating: " + movieInfo.Ratings[1].Value,
            "Country: " +  movieInfo.Country,
            "Language: " + movieInfo.Language,
            "Plot: " + movieInfo.Plot,
            "Actors: " + movieInfo.Actors
        ].join("\n\n");
        console.log(movie);
    });
};

//Task search
function taskSearch () {
    fs.readFile("random.txt","utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var textData = data.split(",");
        var checkingTask = textData[0];
        var checkingArgument = textData[1];
        // console.log(checkingTask);
        // console.log(checkingArgument);
        spotifySearch(checkingArgument);
    })
}

//Switch statement to determine which fork to take based on the arguments passed in
switch(liriChoice) {
    case "concert-this":
        concertSearch();
        break;
    case "spotify-this-song":
        spotifySearch();
        break;
    case "movie-this":
        ombdSearch();
        break;
    case "do-what-it-says":
        taskSearch();
        break;
}