var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var request  = require('request');
var db = require('./db.js');

// The method which redirects to the original url or throws an error informing that there doesnt exist an url
app.get('/:id', function (req, res) {
	/******
	Check if an entry exists with the particular id, else return error
	Checking if the entry exists then send it else send an error
	dbName: Shorturl
	******/
	var id= parseInt(req.params.id,10);
	db.Shorturl.findById(id).then(function (shortenedUrl) {
		if(shortenedUrl) {
			res.redirect(shortenedUrl.originalurl);
		} else {
			responseJSON= {};
			responseJSON.error= "This url is not present";
 			res.status(400).send(responseJSON);
		}
	}).catch(function (e) {
		responseJSON= {};
		responseJSON.error= "An error occured";
 		res.status(400).send(responseJSON);
	})
});

// Get method which shortens the URL and returns back to the user
app.get('/shorten/:url(*)', function (req, res) {
	var url = req.params.url;
	var expression= /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
	var regex= new RegExp(expression);
	if(url.match(regex)) {
		/******
		Check if an url already exists in the database
		If it exists, return the original url and the shortened url
		Else create a row for the original url and then return the original url and the shortened url
		dbName: Shorturl
		******/
		db.Shorturl.findOne({
			where:{
				originalurl: url
			}
		}).then(function (shortenedUrl){
			if(shortenedUrl) {
				var responseJSON = {
					original_url: url,
					short_url: 'pramodvspk-url-shortener.herokuapp.com/'+shortenedUrl.id
				}
				res.json(responseJSON);
			} else {
				db.Shorturl.create({
						originalurl: url
					}).then(function (shortenedUrl) {
						var responseJSON = {
							original_url: url,
							short_url: 'pramodvspk-url-shortener.herokuapp.com/'+shortenedUrl.id
						}
						res.json(responseJSON);
					}).catch(function (e) {
						res.status(500).send(e);
					})

				}
		}).catch(function (e) {
		responseJSON= {};
		responseJSON.error= "An error occured";
 		res.json(responseJSON);
		});

	} else{
		responseJSON= {};
		responseJSON.error= "Please send a valid and a real URL";
		res.status(400).send(responseJSON)
	}

});

// The homepage
app.get('/', function (req, res){
	res.sendFile(__dirname+'/welcome.html');
});

// Synchronize the models with the database
db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log("The server has started on PORT "+PORT);
	});
})