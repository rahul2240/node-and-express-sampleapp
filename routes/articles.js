const express = require('express');
const router = express.Router();



// Bring in models

let Article = require('../models/article');

// Add Article

router.get('/add', function(req, res){
	res.render("add_article", {
		title: "Add new article"
	});
});

// Add submit post route

router.post('/add', function(req, res){
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('author', 'Author is required').notEmpty();
	req.checkBody('body', 'Body is required').notEmpty();

	// Get Errors
	let errors = req.validationErrors();
	if(errors){
		res.render('add_article',{
			title: 'Add Article',
			errors: errors
		});
	} else{

	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err){
		if(err){
			console.log(err);
			return;
		} else {
			res.redirect('/');
		}
	});

	
	}


});

// show a particular article

router.get('/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('article',{
			article: article
		});
	});
});

// Edit a article

router.get('/edit/:id', function(req, res){
	Article.findById(req.params.id, function(err, article){
		res.render('edit_article',{
			article: article
		});
	});
});

router.post('/edit/:id', function(req, res){
	
	let query = {_id: req.params.id}
	let article = {}
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body; 

	Article.update(query, article, function(err){
		if(err){
			console.log(err);
		} else {
			req.flash('success', 'Article Updated');
			res.redirect('/');
		}
	});

});

// Delete a article

router.delete('/:id', function(req, res){
	let query = {_id:req.params.id}

	Article.remove(query, function(err){
		if(err){
			console.log(err);
		}
		res.send('Success');
	});
});

module.exports = router;