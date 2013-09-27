'use strict';
//setup Dependencies
var connect = require('connect');
var express = require('express');
var port = 54321;
//Setup Express
var expressServer = express();
expressServer.configure(function ()
{
	expressServer.set('views', __dirname + '/views');
	expressServer.set('view options', { layout : false });
	expressServer.use(connect.bodyParser());
	expressServer.use(express.cookieParser());
	expressServer.use(express.session({ secret : 'shhhhhhhhh!'}));
	expressServer.use(connect.static(__dirname + '/static'));
	expressServer.use(expressServer.router);
	expressServer.use(function (err, req, res, next)
	{
		console.error(err.stack);
//		res.render('500.jade', {zzzzzzzzzzzzzzzzzzzzzzzzzzzz : err});
		res.render('500.jade', {error : err});
	});
});
expressServer.listen(port);
///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////
/////// ADD ALL YOUR ROUTES HERE  /////////
expressServer.get('/', function (req, res)
{
	res.render('index.jade', {
		locals : {
			title           : 'Your Page Title',
			description     : 'Your Page Description',
			author          : 'Your Name',
			analyticssiteid : 'XXXXXXX'
		}
	});
});
//A Route for Creating a 500 Error (Useful to keep around)
expressServer.get('/500', function (req, res)
{
	throw new Error('This is a 500 Error');
});
expressServer.get('/*', function (req, res)
{
	throw new Error('This is a 404 Error');
});
console.log('Listening on http://localhost:' + port);
