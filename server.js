var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var request  = require('request');
var db = require('./db.js');

// Using a regular expression to match the '/' in the URL
app.get('/shorten/:url(*)', function (req, res) {
	var returnJSON = {};
	var url= req.params.url;
	var expression= /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
 	var regex= new RegExp(expression);
 	if(url.match(regex)){
 		request('https://api-ssl.bitly.com/v3/shorten?access_token=52458fac3b6cd42d41ab9fe6a4df043740d2ccd7&longUrl='+url, function (error, response, body) {
 			if(!error && response.statusCode==200){
 				var bodyJSON= JSON.parse(body);
				returnJSON.original_url= url;
 				returnJSON.short_url= bodyJSON.data.url;
 				res.json(returnJSON);
 			}else{
 				returnJSON.error= "There was a problem with the URL you sent";
 				res.json(returnJSON);
 			}
 		});
 	}else{
 		returnJSON.error= "Please send a valid and real URL";
 		res.json(returnJSON);
 	}
});


app.get('/:id', function (req, res) {
	var id= parseInt(req.params.id,10);

	// Check if an entry exists with the particular id, else return error
	// Checking if the entry exists
});


app.post('/shorten/:url(*)', function (req, res) {
	var url = req.params.url;
	var expression= /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;
	var regex= new RegExp(expression);
	if(url.match(regex)) {
		// check if the url already exists, if not create the item 


		// Checking if the URL exists
		db.Shorturl.findOne({
			where:{
				longurl: url
			}
		}).then(function (shortenedUrl){
			// If it exists, then return back the item
			if(shortenedUrl) {
				var responseJSON = {
					original_url: url,
					short_url: 'pramodvspk-url-shortener.herokuapp.com/'+shortenedUrl.id
				}
				res.json(responseJSON);
			} else {
				// Else create the item and return it
				db.Shorturl.create({
						longurl: url
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


app.get('/', function (req, res){
	res.send("Welcome to url shortener");
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log("The server has started on PORT "+PORT);
	});
})