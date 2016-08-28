/////////////////////////////
////    server side     ////
///////////////////////////

// dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// first route
app.get('/', function(req, res) {
	res.render('index')
});

// second route
app.get('/loadarticles', function(req, res){
	var articleData = require('./data/articles');
	res.json(articleData);
});

// third route
app.get('/morearticles', function(req, res){
	var articleData = require('./data/more-articles');
	res.json(articleData);
});


app.listen(3000)  
