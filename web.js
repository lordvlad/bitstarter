#!/usr/bin/env node

var express = require('express');
var port = process.env.PORT || 8080;
var fs = require('fs');
var hogan = require('hogan-express');
var flash= require('connect-flash');

var app = express()
    .set('view engine', 'html')
    .set('layout', 'layout')
    .set('views', __dirname + '/views')
    .set('partials', {head: 'head', foot: 'foot'})
    .enable('view cache')
    .engine('html', hogan)
    .use(express.compress())
    .use(express.bodyParser())
    .use(express.cookieParser('asfag4asg5as6g54asg657asg87as98g'))
    .use(express.session({cookie: {maxAge: 60000 }}))
    .use(flash())
    .get('/', function(req, res){	
	res.render('index', {
	    title: 'your signs - deine gebärden',
	    success: req.flash('success'),
	    info: req.flash('info'),
	    error: req.flash('error')
	});
    })
    .post('/subscribe', function(req, res){
	fs.appendFile('emails.dat', req.body.email+"\n", 'utf-8', function(err){
	    if (err){
		req.flash('error', 'Deine Email konnte nicht gespeichert werden.<br /><br />' + err)
	    }
	    req.flash('success', 'Vielen Dank für deine Anmeldung.');
	    res.redirect('/');
	});
    })
    .use(express.static(__dirname + '/static'))
    .listen(port, function(){
	console.log("listening on " + port);
    });