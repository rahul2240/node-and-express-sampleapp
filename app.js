const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', function(){
	console.log('Connected to MongoDb');
});


// Check for db error

db.on('error', function(err){
	console.log(err);
});
// Init App
const app = express();

// Bring in models

let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', function(req, res){
	Article.find({}, function(err, article){
		if(err){
			console.log(err);
		} else {
		res.render("index", {
		title: "Article",
		articles: article
	});
	}
	});
	
});

// Add Article

app.get('/articles/add', function(req, res){
	res.render("add_article", {
		title: "Add new article"
	});
});

// Add submit post route

app.post('/articles/add', function(req, res){
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

// show a particular article

app.get('/articles/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('article',{
			article: article
		});
	});
});

// Edit a article

app.get('/articles/edit/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('edit_article',{
			article: article
		});
	});
});

app.post('/articles/edit/:id', function(req, res){
	
	let query = {_id: req.params.id}
	let article = {}
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body; 

	Article.update(query, article, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
	});

});

// Delete a article

app.delete('/article/:id', function(req, res){
	let query = {_id:req.params.id}

	Article.remove(query, function(err){
		if(err){
			console.log(err);
		}
		res.send('Success');
	});
});


// Start Server
app.listen(3000, function(){
	console.log("server started on port 3000");
});