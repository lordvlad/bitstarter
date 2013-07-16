#!/usr/bin/env node
var express = require('express'),
port = process.env.PORT || 8080;
os = require('os'),
fs = require('fs'),
app = express.createServer()
    .use(express.logger())
    .use(express.static(__dirname + '/static'))
    .use(express.compress())
    .listen(port, function(){
	console.log("listening on " + port);
    });