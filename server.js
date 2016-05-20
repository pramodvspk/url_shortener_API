var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var request  = require('request');

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

app.get('/', function (req, res){
	res.send("Welcome to url shortener");
});

app.listen(PORT, function () {
	console.log("The server has started on PORT "+PORT);
});