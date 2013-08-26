#!/usr/bin/env node

var express = require('express');
var port = process.env.PORT || 8080;
var fs = require('fs');
var dict = require('./dgs');

var app = express()
    .use(dict)
    .use(express.compress())
    .use(express.bodyParser())
    .post('/subscribe', function(req, res){
	fs.appendFile('emails.dat', req.body.email+"\n", 'utf-8', function(err){
	    if (err){ res.end(err);}
	    res.send("vielen Dank.<br><br><a href='/'>zurück</a>");
	});
    })
    .use(express.static(__dirname + '/static'))
    .listen(port, function(){
	console.log("listening on " + port);
    });
