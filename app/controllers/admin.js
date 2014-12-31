
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

exports.superIndex = function(req, res) {
  res.render('super/index');
}

exports.index = function(req, res) {

}