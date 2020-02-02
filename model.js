var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExampleSchema object
// This is similar to a Sequelize model
var newsArticle = new Schema({
  link: {
    type: String,
    trim: true,
    required: "Link is Required"
  },
  title: {
    type: String,
    trim: true,
    required: "Title is Required"
  },
  details: {
    type: String,
    trim: true,
    required: "Details is Required"
  },
  searchQuery: {
    type: String,
    trim: true,
    required: "Search Query is Required"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("newsArticle", newsArticle);

// Export the Example model
module.exports = Article;