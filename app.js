const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const _ = require("lodash");
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Connection URL
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);



//////////////////////////////////////////////////////-----All Articles-----////////////////////////////////////////////////////////



app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err) {
            // console.log(foundArticles);
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if (!err) {
            res.send("Sucessfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

// app.get("/articles", );
// app.post("/articles", );
// app.delete("/articles", );



///////////////////////////////////////////-----A Specific Articles-----//////////////////////////////////////////////////



app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("Title is not matching.");
        }
    });
})

.put(function(req, res){
    Article.replaceOne(
        {title: req.params.articleTitle},
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite: true},
        function(err) {
            if (err) {
                console.log(err);
            } else {
                res.send("Successfully updated article."); 
            }
        });
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if (err) {
                console.log(err);
            } else {
                res.send("Successfully updated article."); 
            }
        });
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if (!err) {
                res.send("Successfully deleted the article.");
            }
        });
});





app.listen(3000, function () {
    console.log("server started on port 3000");
});