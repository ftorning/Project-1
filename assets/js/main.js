console.log("main.js loaded");

// Initialize Firebase
try {
    var config = firebaseConfig;
    firebase.initializeApp(config);
    db = firebase.database();
    console.log('Successfully initialized database');
} catch {
    console.log('Failed to initialize database');
}

// Initialize Sentimood
var sentimood = new Sentimood();

// Example analysis
console.log(sentimood.analyze("This amazing project kick ass"));


// Delete this out - just for reference
var title = $('#title');
var wink = $('#wink');
title.css('text-align', 'center');
wink.css('height', '30px');



class Topic {
    constructor(queryString, firstSource, secondSource) {
        this.queryString = queryString;
        this.firstSource = firstSource;
        this.secondSource = secondSource;
        this.firstSourceSentiment;
        this.secondSource
    }

    setSources() {

    }
}


// news API

/*

https://newsapi.org/v2/top-headlines?
pageSize=5&
apiKey=efb42eaae6b94bce83b1568d1127f897&
sources=cnn,fox-news,the-huffington-post,bbc-news,breitbart-news,vice-news&
q=trump

*/
// function buildAllURL() 


$("#run-search").on("click", function(event){

    event.preventDefault();

// Grab text the user typed into the search input, add to the queryParams object
var searchParam = $("#search-term").val().trim();
var baseURL = "https://newsapi.org/v2/top-headlines?pageSize=5&apiKey=efb42eaae6b94bce83b1568d1127f897&sources=";
var sources = ["cnn","fox-news","the-huffington-post","bbc-news","breitbart-news","vice-news"];

// queryURL is the url we'll use to query the API
var queryURL = baseURL + sources[i] + "&q=" + searchParam;

for (var i = 0; i < sources.length; i++) {
    var allURL= {
        cnn: baseURL + sources[0] + "&q=" + searchParam,
        fox: baseURL + sources[1] + "&q=" + searchParam,
        huff: baseURL + sources[2] + "&q=" + searchParam,
        bbc: baseURL + sources[3] + "&q=" + searchParam,
        bart: baseURL + sources[4] + "&q=" + searchParam,
        vice: baseURL + sources[5] + "&q=" + searchParam
    }

};

console.log(allURL.cnn);
console.log(allURL.fox);
console.log(allURL.huff);
console.log(allURL.bbc);
console.log(allURL.bart);
console.log(allURL.vice);

$.ajax({
    url: allURL.cnn,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

$.ajax({
    url: allURL.fox,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

$.ajax({
    url: allURL.huff,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

$.ajax({
    url: allURL.bbc,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

$.ajax({
    url: allURL.bart,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

$.ajax({
    url: allURL.vice,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

});





