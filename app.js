/////////////////////////////
////    server side     ////
///////////////////////////

// dependencies
var express = require('express');
var path = require('path');
var app = express();
var moment = require('moment');
moment().format();	

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

// Convert date to time ago
var convertDates = function(e){
	for(var i = 0; i < e.length; i++) {
		var timeStamp = e[i].publish_at;
		var timeString = String(timeStamp);
		var timeAgo = moment(timeString, "YYYY-MM-DD h:mm:ss").fromNow();
		e[i].time_ago = timeAgo;
	}
};

var articleData1 = require('./data/articles');
var articleData2 = require('./data/more-articles');
var articleTotal = articleData1.length + articleData2.length;

// first route
app.get('/', function(req, res) {
	res.render('index',
		{ articleTotal : articleTotal }
	)
});

// second route
app.get('/loadarticles', function(req, res){
	convertDates(articleData1);
	res.send(articleData1);
});

// third route
app.get('/morearticles', function(req, res){
	convertDates(articleData2);	
	res.send(articleData2);
});

// Run on http://localhost:3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})