var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");
var Article = require("./model.js");
require('dotenv').config()

var app = express();

// Set the app up with morgan.
// morgan is used to log our HTTP Requests. By setting morgan to 'dev'
// the :status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes,
// and uncolored for all other codes.
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/userdb", { useNewUrlParser: true });
var results = [];

app.get("/search", function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.get("/scrape/:searchQuery", function(req, res) {
  let searchQuery = req.params.searchQuery
  scrape(searchQuery, function() {
    Article.find({
      searchQuery: searchQuery
    }).then((articles) => {
      res.send(articles)
    }).catch((err) => {
      res.send(err)
    })
  });
});

app.get("/articles", function(req, res) {
  Article.find({}).then((articles) => {
    res.send(articles)
  }).catch((err) => {
    res.send(err)
  })
})

app.listen(3000, function() {
  console.log("App running on port 3000!");
});

function scrape(searchQuery, callBack) {

  axios.get("https://www.nytimes.com/search?query="+ searchQuery).then(function(response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrap

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("li").each(function(i, element) {

      if (element.parent.name == "ol") {
        let title = $(element).children().text();
        let link = $(element).find("a").attr("href");
        let details = $(element).find("span").text()
        if(details.length > 0) {
          Article.findOneAndUpdate({
            title: title,
            link: link,
            details: details,
            searchQuery: searchQuery
          },
          {
            title: title,
            link: link,
            details: details,
            searchQuery: searchQuery
          }, {
            new: true,
            upsert: true // Make this update into an upsert
          }).then((article) => {
            console.log(article)
          }).catch((error) => {
            console.log(error)
          })
        }
      }
    });
    callBack()
  });
}