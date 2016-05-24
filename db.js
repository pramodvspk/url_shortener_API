// Load modules into sequelize and return connection to server.js

var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/url-shortner-db.sqlite'
});

var db = {};

// sequelize.import allows you to import models from different files
db.Shorturl = sequelize.import(__dirname+'/models/Shorturl.js');
db.sequelize = sequelize;
db.Sequelize= Sequelize;

module.exports = db;