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

// results per source -- keep 1-2 for testing, ~5-10 when ready to demo
var resultsPerSource = 2; 

var searchParam = $("#search-term").val().trim();
var baseURL = "https://newsapi.org/v2/top-headlines?pageSize=" + resultsPerSource + "&apiKey=efb42eaae6b94bce83b1568d1127f897&sources=";
var currentTopic;


class Topic {
    constructor(queryString, timestamp=null, articleResults=null) {
        this.queryString = queryString;
        // hard-coded sources
        this.sources = ["cnn","fox-news","the-huffington-post","bbc-news","breitbart-news","vice-news"];
        // timestamp 
        this.timestamp = this.setTimestamp(timestamp);
        // actual article results with individual sentiment scores
        this.articleResults = this.querySource(articleResults);
        // aggregate sentiment scores
        // not implemented yet
        // this.highSentimentArticle;
        // this.lowSentimentArticle;
    }

    setTimestamp(timestamp) {
        if (!timestamp) {
            return new Date().getTime();
        } else {
            return timestamp;
        }
        
    }

    getSentimentScores() {
        var res = [];
        // each source, loop through and is the article source matches, sum sentiment score
        for (let i = 0; i < this.sources.length; i++) {
            let sum = 0;
            let count = 0;
            let aggScore = {};
            // issue here
            for (var j = 0; j < this.articleResults.length; j++) {
                if (this.sources[i] === this.articleResults[j].source.id) {
                    sum += this.articleResults[j].sentiment;
                    count++;
                }
            }
            aggScore[this.sources[i]] = sum / count;
            res.push(aggScore);
        }
        return res;

    }
        
    populateResults() {
        $('#aggDisplay td').empty();
        
        
        var data = this.getSentimentScores();
        console.log(data);
        if(data.length < 1) {
             // modal window pop-up

         } else {   //{cnn:1.5}
            for (var i = 0; i < data.length; i++) {
                switch (Object.keys(data[i])[0]) {
            
                    case "cnn": //Object.keys(data[i])[0] === "cnn";

                    $("#cnn").append(Object.values(data[i])[0]);
                    break;

                    case "fox-news": //Object.keys(data[i])[0] === "fox-news";
                    $("#fox").append(Object.values(data[i])[0]);
                    break;

                    case "the-huffington-post": //Object.keys(data[i])[0] === "the-huffington-post";
                    $("#huff").append(Object.values(data[i])[0]);
                    break;

                    case "bbc-news": //Object.keys(data[i])[0] === "bbc-news";
                    $("#bbc").append(Object.values(data[i])[0]);
                    break;

                    case "breitbart-news": //Object.keys(data[i])[0] === "breitbart-news";
                    $("#breit").append(Object.values(data[i])[0]);
                    break;

                    case "vice-news": //Object.keys(data[i])[0] === "vice-news";
                    $("#vice").append(Object.values(data[i])[0]);
                    break;

                }
            }
        }
    }

    populateMaxMinArticles() {
        var maxArticles = [];
        var minArticles = [];
        
        for (var i = 20; i >= -20; i--) {
            for (var j = 0; j < this.articleResults.length; j++) {
                if (this.articleResults[j].sentiment === i && maxArticles.length <= 3) {
                    maxArticles.push(this.articleResults[j]);
                } else if (this.articleResults[j].sentiment === (i * -1) && minArticles.length <= 3) {
                    minArticles.push(this.articleResults[j]);
                }
            }    
        }
        
        // TODO - iterate through maxArticles & maxArticles and add them to the appropriate html elements
        console.log(maxArticles);
        console.log(minArticles);
    }
    
    commit() {
        db.ref('/topic').push(this).then((snapshot) => {
            currentTopic = snapshot.key;
        });
        return 0;
    }

    querySource(articleResults) {
        if (articleResults) {
            return articleResults;
        } else {
            // Combine Kevin's code
            var baseURL = "https://newsapi.org/v2/everything?pageSize=5&apiKey=" + newsApiKey +  "&q=" + this.queryString + "&sources=";
            var res = [];
            var that = this;
            for (let i = 0; i < this.sources.length; i++) {
                var source = this.sources[i];
                $.ajax({
                    url: (baseURL + source),
                    method: "GET"
                }).then(function(response) {
                    for (let v = 0; v < response.articles.length; v++) {
                        let articleString = response.articles[v].title + " " + response.articles[v].description        
                        response.articles[v].sentiment = sentimood.analyze(articleString).score;
                        res.push(response.articles[v]);
                    };
                });
            }
            return res;
        }
    }

    getTimestamp() {
        return this.timestamp;
    }
}

$("#run-search").on("click", function(event){

    event.preventDefault();
    var searchParam = $("#search-term").val().trim();
    var topic = new Topic(searchParam);
    topic.querySource()//.commit()
    setTimeout(function(){
        topic.commit();
        console.log("here in timeout loop");
        topic.populateResults();
    }, 5000);
    // do other stuff
});

db.ref('topic').on("child_added", function(snapshot) {
    var newItem = $('<button>');
    newItem.text(snapshot.val().queryString)
    newItem.val(snapshot.key);
    newItem.addClass(["btn", "btn-primary"]);
    $('#recent-searches').prepend(newItem);
    
       
});

$("body").on("click", '#recent-searches .btn', function(event) {
    event.preventDefault();
    console.log("here");
    console.log($(this).val());
    
});

