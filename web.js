#!/usr/bin/env node
var express = require('express'),
os= require('os'),
app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('hey sexy bitch!');
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
    console.log(os.networkInterfaces());
});