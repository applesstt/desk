
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

exports.index = function(req, res) {
  var page = 0;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page,
    criteria: {}
  };

  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    Article.count().exec(function (err, count) {
      res.render('demo/index', {
        title: 'Home',
        articles: articles,
        isHome: true
      });
    });
  });
}