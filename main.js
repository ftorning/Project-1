


$("#run-search").on("click", function(event){

    event.preventDefault();

    // Grab text the user typed into the search input, add to the queryParams object
    var searchParam = $("#search-term").val().trim();
    var baseURL = "https://newsapi.org/v2/top-headlines?pageSize=5&apiKey=efb42eaae6b94bce83b1568d1127f897&sources=";
    var sources = ["cnn","fox-news","the-huffington-post","bbc-news","breitbart-news","vice-news"];
    var allURL= {
        cnn: baseURL + sources[0] + "&q=" + searchParam,
        fox: baseURL + sources[1] + "&q=" + searchParam,
        huff: baseURL + sources[2] + "&q=" + searchParam,
        bbc: baseURL + sources[3] + "&q=" + searchParam,
        bart: baseURL + sources[4] + "&q=" + searchParam,
        vice: baseURL + sources[5] + "&q=" + searchParam
    
    };

    for (var key in allURL) {

        if (allURL.hasOwnProperty(key)) {
            console.log(key + " = " + allURL[key]);
        
            $.ajax({
                url: allURL[key],
                method: "GET"
            }).then(function(response) {
                  console.log(response);
            });
        }   
    }   
    });

//closing the click listener function


//     if (!response.articles === "") { 
            // for (var i = 0; i < response.articles.length; i++){