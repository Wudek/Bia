'use strict';
//setup Dependencies
var connect = require('connect');
var express = require('express');
var io = require('socket.io');
var port = (process.env.PORT || 8081);
//Setup Express
var server = express();
server.configure(function ()
{
	server.set('views', __dirname + '/views');
	server.set('view options', { layout : false });
	server.use(connect.bodyParser());
	server.use(express.cookieParser());
	server.use(express.session({ secret : 'shhhhhhhhh!'}));
	server.use(connect.static(__dirname + '/static'));
	server.use(server.router);
});
//setup the errors
server.error(function (err, req, res, next)
{
	//	if (err instanceof NotFound)
	//	{
	//		res.render('404.jade', { locals : {
	//			title           : '404 - Not Found',
	//			description     : '',
	//			author          : '',
	//			analyticssiteid : 'XXXXXXX'
	//		}, status                       : 404 });
	//	}
	//	else
	//	{
	res.render('500.jade', { locals : {
		title           : 'The Server Encountered an Error',
		description     : '',
		author          : '',
		analyticssiteid : 'XXXXXXX',
		error           : err
	}, status                       : 500 });
	//	}
});
server.listen(port);
//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function (socket)
{
	console.log('Client Connected');
	socket.on('message', function (data)
	{
		socket.broadcast.emit('server_message', data);
		socket.emit('server_message', data);
	});
	socket.on('disconnect', function ()
	{
		console.log('Client Disconnected.');
	});
});
///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////
/////// ADD ALL YOUR ROUTES HERE  /////////
server.get('/', function (req, res)
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
server.get('/500', function (req, res)
{
	throw new Error('This is a 500 Error');
});
server.get('/*', function (req, res)
{
	throw new Error('This is a 404 Error');
});
console.log('Listening on http://0.0.0.0:' + port);
