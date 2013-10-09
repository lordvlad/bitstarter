
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , utils = require('../../lib/utils')
  , _ = require('underscore')



exports.index = function(req, res){
    res.render('index.html');
}