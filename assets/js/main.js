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
        // hard-coded sources
        this.sources = ["cnn","fox-news","the-huffington-post","bbc-news","breitbart-news","vice-news"];
        // actual article results with individual sentiment scores
        this.articleResults = [];
        // aggregate sentiment scores
        this.sentimentScores = [];
        // not implemented yet
        this.highSentimentArticle;
        this.lowSentimentArticle;
    }

    setSentimentScores() {
        // ofirst calculate individual scores
        for (let a = 0; a < this.articleResults.length; a++) {
            // conatenate title and description for analysis
            let articleString = this.articleResults[a].title + " " + this.articleResults[a].description
            // create a new sentiment key for each article and set val to sentimood results
            this.articleResults[a].sentiment = sentimood.analyze(articleString);
        }
        // each source, loop through and is the article source matches, sum sentiment score
        for (let i = 0; i < this.sources.length; i++) {
            let sum = 0;
            let count = 0;
            let aggScore = {};
            for (var j = 0; j < this.articleResults.length; j++) {
                if (this.sources[i] === this.articleResults[j].source.id) {
                    sum += this.articleResults[j].sentiment.score
                    count++;
                }
            }
            aggScore[this.sources[i]] = sum / count;
            this.sentimentScores.push(aggScore);
        }
        console.log(this.sentimentScores);
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
