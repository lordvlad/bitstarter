#!/usr/bin/env node
var express = require('express'),
os= require('os'),
app = express.createServer(express.logger());

app.get('/', function(request, response) {
    response.send(new Buffer(fs.readFileSync('index.html', 'utf-8')).toString('utf-8'));
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log("Listening on " + port);
    console.log(os.networkInterfaces());
});