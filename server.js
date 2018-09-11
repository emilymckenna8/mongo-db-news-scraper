//dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var mongojs = require("mongojs");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require("axios");
const cheerio = require("cheerio");

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var db = require("./models");
mongoose.connect("mongodb://localhost/scraperDB");

// Routes
app.get("/scrape", function(req, res){
  axios.get("http://pitchfork.com/reviews/albums/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("div.review").each(function(i, element) {
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.artist = $(this)
        .children("a.review__link")
        .children("div.review__title")
        .children("ul.artist-list")
        .children("li")
        .text();
      result.albumName = $(this)
        .children("a.review__link")
        .children("div.review__title")
        .children("h2.review__title-album")
        .text();
      result.link = $(this)
        .children("a.review__link")
        .attr("href");
      result.img = $(this)
        .children("a.review__link")
        .children("div.review__artwork")
        .children("div")
        .children("img")
        .attr("src");  
      console.log(result);
      // Create a new Item
      db.Item.create(result)
        .then(function(dbItem) {
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  })
});

// Retrive all them items from the DB
app.get("/items", function(req, res) {
  db.Item.find({})
    .then(function(dbItem) {
      res.json(dbItem);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Like an item
app.post("/like/:id", function(req, res) {
  console.log(req.params.id)
  db.Item.update(
    {
      _id: req.params.id
    },
    {
      $set: {
        liked: true,
      }
    },
    function(error, edited) {
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        console.log(edited);
        res.send(edited);
      }
    }
  );
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
