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
        this.articleResults = [];
        this.queryString = queryString;
        // hard-coded sources
        this.sources = ["cnn","fox-news","the-huffington-post","bbc-news","breitbart-news","vice-news"];
        // timestamp 
        this.timestamp = this.setTimestamp(timestamp);
        // actual article results with individual sentiment scores
          this.querySource(articleResults);
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
        var data = this.getSentimentScores();
        // console.log(data[0].cnn);
        // console.log(Object.getOwnPropertyNames(data[0]));
        if(data.length < 1) {
             // modal window pop-up

         } else {   //{cnn:1.5}
            for (var i = 0; i < data.length; i++) {
                console.log("This is the thing that does it", Object.keys(data[i])[0])

            switch (Object.keys(data[i])[0]) {
        
            case "cnn": //Object.keys(data[i])[0] === "cnn";
            console.log("The average sentimentScore for CNN is:", Object.values(data[i])[0]); //sentiment score
            $("#cnn").append(Object.values(data[i])[0]);
            break;

            case "fox-news": //Object.keys(data[i])[0] === "fox-news";
            console.log("The average sentimentScore for Fox News is:", Object.values(data[i])[0]); //sentiment score
            $("#fox").append(Object.values(data[i])[0]);
            break;

            case "the-huffington-post": //Object.keys(data[i])[0] === "the-huffington-post";
            console.log("The average sentimentScore for Huffington Post is:", Object.values(data[i])[0]); //sentiment score
            $("#huff").append(Object.values(data[i])[0]);
            break;

            case "bbc-news": //Object.keys(data[i])[0] === "bbc-news";
            console.log("The average sentimentScore for BBC is:", Object.values(data[i])[0]); //sentiment score
            $("#bbc").append(Object.values(data[i])[0]);
            break;

            case "breitbart-news": //Object.keys(data[i])[0] === "breitbart-news";
            console.log("The average sentimentScore for Breitbart is:", Object.values(data[i])[0]); //sentiment score
            $("#breit").append(Object.values(data[i])[0]);
            break;

            case "vice-news": //Object.keys(data[i])[0] === "vice-news";
            console.log("The average sentimentScore for Vice is:", Object.values(data[i])[0]); //sentiment score
            $("#vice").append(Object.values(data[i])[0]);
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
            console.log(this);
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
                        that.makeArticle(response.articles[v]);
                    };
                    
                });
            }
            //console.log(res);
            //that.articleResults = res;
        }
    }

    getTimestamp() {
        return this.timestamp;
    }
    makeArticle(article){
        this.articleResults.push(article);
    }
    
}

$("#run-search").on("click", function(event){

    event.preventDefault();
    var searchParam = $("#search-term").val().trim();
    var topic = new Topic(searchParam);
    // set time out so ajax is finished running before the topic is called , else 0 array length shows up
    setTimeout (function(){
        var results = Array.from(topic.articleResults);
    console.log(results.length);
    //topic.commit()
    
    //html for news api data array
    var html = "" ;
    for (let i = 0; i < results.length ; i++) {
        let article = results[i];
        console.log(article);
        let title = article.title;
        let src = article.urlToImage;
        let url = article.url;
        let newsSource = article.source.name;
        let sentiscore = article.sentiment.score;
        let pubDate = article.publishedAt;
        html += "<article>" ;
        html += '<div class="single-news mb-4">';
        html += '<div class="row">';
        html += '<div class="col-md-3">';
        
//html for sentiscore and img       
        html += '<div class="view overlay rounded z-depth-1 mb-4" id=image-score>';
        html += "<img class='img-fluid' src='" + src +"' >";
        html += "<span class='badge badge-pill badge-danger' id='sentiscore'> Sentiscore : " + sentiscore + "</span>";
        html += '<a><div class="mask rgba-white-slight"></div></a>';
        html += "</div>";
        html += "</div>";
//html for content 
        html += "<div class='col-md-9' id=source-titleDate>";
        html += '<p class="news-source font-weight-bold dark-grey-text" id="source">' + newsSource +'</p>';
        html += '<div class="d-flex justify-content-between">';
        html += '<div class="col-11 text-truncate pl-0 mb-3">';
        html += "<h3 id='title'>" + "<a href= '" + url + "'</a>" + title + "</h3>";
        html += "<h6 id='date'>" + pubDate + "</h6>";
        html += "</div>";
        html += "</div>";


 //closing tags for the columns       
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += "</article>";
    }
    console.log(html);
    $("#article-section").html(html);
    }, 500);
    
    

    
});
