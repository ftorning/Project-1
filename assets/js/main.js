console.log("main.js loaded");
var db;
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

var searchParam = $("#search-term").val().trim();
var baseURL = "https://newsapi.org/v2/top-headlines?pageSize=5&apiKey=efb42eaae6b94bce83b1568d1127f897&sources=";


class Topic {
    constructor(queryString) {
        this.queryString = queryString;
        this.timestamp = new Date().getTime();
        this.sources = ["cnn","fox-news","the-huffington-post","bbc-news","breitbart-news","vice-news"];
        this.articleResults = [];
        this.sentimentScores = {};
        this.highSentimentArticle;
        this.lowSentimentArticle;
    }

    setSentimentScores() {
        for (let i = 0; i < this.sources.length; i++) {
            for (var j = 0; j < this.articleResults.length; j++) {
                console.log("source: " + this.sources[i] + "article result:" + this.articleResults[j].source.id);
                if (this.sources[i] === this.articleResults[j].source.id) {
                    console.log("here");
                }
            }
        }
        console.log(response);
        // TODO - process the response and create an object with average sentiment for each 
        return 0;
    }

    populateResults() {
        if(this.articleResults.length < 1) {
            // modal window pop-up
        } else {
            // populate results
        }
    }

    getLinearScaleElement() {
        var temp = [{"cnn": 10,
                    "fox-news": 12,
                    "the-huffington-post": 15,
                    "bbc-news": 11,
                    "breitbart-news": 8,
                    "vice-news": 5}] 
        for (var i = 0; i < temp.length; i++) {
            //TODO use d3 to create a linear scale
            }
        return 0;
    }

    commit() {
        db.ref('/topic').push(this);
        return 0;
    }

    querySource() {
        // Combine Kevin's code
        var baseURL = "https://newsapi.org/v2/everything?pageSize=2&apiKey=" + newsApiKey +  "&q=" + this.queryString + "&sources=";
        var that = this;
        for (let i = 0; i < this.sources.length; i++) {
            var source = this.sources[i];
            $.ajax({
                url: (baseURL + source),
                method: "GET"
            }).then(function(response) {
                for (let v = 0; v < response.articles.length; v++) {
                    // console.log(response.articles[v]);
                    that.articleResults.push(response.articles[v]);
                };
            });
        }

        return 0;
    }


}


$("#run-search").on("click", function(event){

    event.preventDefault();
    var searchParam = $("#search-term").val().trim();
    var topic = new Topic(searchParam);
    topic.querySource()//.commit()
    topic.commit()
    
    // do other stuff
    

    console.log(topic.articleResults);
});
