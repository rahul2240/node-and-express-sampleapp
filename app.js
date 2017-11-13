const express = require('express');
const path = require('path');

// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Home route
app.get('/', function(req, res){
	let articles = [
	{
		id: 1,
		title: 'Article one',
		body: 'this is article one'
	},
	{
		id: 1,
		title: 'Article two',
		body: 'this is article two'
	},
	{
		id: 3,
		title: 'Article three',
		body: 'this is article three'
	}

	];


	res.render("index", {
		title: "hello",
		articles: articles
	});

});

// Add Article

app.get('/articles/add', function(req, res){
	res.render("add_article", {
		title: "hello"
	});
});


// Start Server
app.listen(3000, function(){
	console.log("server started on port 3000");
});