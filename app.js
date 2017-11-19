const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

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

// Express session middle ware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Express messages middle ware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.');
		root = namespace.shift();
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}

		return {
			param: formParam
			,msg: msg
			,value: value
		};
	}
}));

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

// route files

let articles = require('./routes/articles');
app.use('/articles', articles)

// Start Server
app.listen(3000, function(){
	console.log("server started on port 3000");
});