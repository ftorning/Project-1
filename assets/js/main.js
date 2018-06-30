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
                    console.log(this.articleResults[j].sentiment.score);
                    sum += this.articleResults[j].sentiment.score
                    count++;
                }
            }
            aggScore[this.sources[i]] = sum / count;
            res.push(aggScore);
        }
        console.log(res);
        return res;

    }
        
    populateResults() {
        // console.log(this.sentimentScores[0].cnn);
        // console.log(Object.getOwnPropertyNames(this.sentimentScores[0]));
        if(this.articleResults.length < 1) {
             // modal window pop-up

         } else {   //{cnn:1.5}
            for (var i = 0; i < this.sentimentScores.length; i++) {
                console.log("This is the thing that does it", Object.keys(this.sentimentScores[i])[0])

            switch (Object.keys(this.sentimentScores[i])[0]) {
        
            case "cnn": //Object.keys(this.sentimentScores[i])[0] === "cnn";
            console.log("The average sentimentScore for CNN is:", Object.values(this.sentimentScores[i])[0]); //sentiment score
            $("#cnn").append(Object.values(this.sentimentScores[i])[0]);
            break;

            case "fox-news": //Object.keys(this.sentimentScores[i])[0] === "fox-news";
            console.log("The average sentimentScore for Fox News is:", Object.values(this.sentimentScores[i])[0]); //sentiment score
            $("#fox").append(Object.values(this.sentimentScores[i])[0]);
            break;

            case "the-huffington-post": //Object.keys(this.sentimentScores[i])[0] === "the-huffington-post";
            console.log("The average sentimentScore for Huffington Post is:", Object.values(this.sentimentScores[i])[0]); //sentiment score
            $("#huff").append(Object.values(this.sentimentScores[i])[0]);
            break;

            case "bbc-news": //Object.keys(this.sentimentScores[i])[0] === "bbc-news";
            console.log("The average sentimentScore for BBC is:", Object.values(this.sentimentScores[i])[0]); //sentiment score
            $("#bbc").append(Object.values(this.sentimentScores[i])[0]);
            break;

            case "breitbart-news": //Object.keys(this.sentimentScores[i])[0] === "breitbart-news";
            console.log("The average sentimentScore for Breitbart is:", Object.values(this.sentimentScores[i])[0]); //sentiment score
            $("#breit").append(Object.values(this.sentimentScores[i])[0]);
            break;

            case "vice-news": //Object.keys(this.sentimentScores[i])[0] === "vice-news";
            console.log("The average sentimentScore for Vice is:", Object.values(this.sentimentScores[i])[0]); //sentiment score
            $("#vice").append(Object.values(this.sentimentScores[i])[0]);
            break;

            }
          }
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

    querySource(articleResults) {
        if (articleResults) {
            return articleResults;
        } else {
            // Combine Kevin's code
            var baseURL = "https://newsapi.org/v2/everything?pageSize=2&apiKey=" + newsApiKey +  "&q=" + this.queryString + "&sources=";
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
                        // console.log(response.articles[v]);
                        response.articles[v].sentiment = sentimood.analyze(articleString);
                        res.push(response.articles[v]);
                    };
                });
            }
            console.log(res);
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
    topic.commit()
    
    // do other stuff
    

    console.log(topic.articleResults);
});
