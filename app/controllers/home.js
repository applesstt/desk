
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var HomeArticle = mongoose.model('HomeArticle');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

var _fillHomeArticles = function(homeArticles) {
  var retArticles = [];
  for(var i = 0; i < 10; i++) {
    var tempArticles = {
      index: i
    };
    for(var j = 0; j < homeArticles.length; j++) {
      if(i === homeArticles[j].index) {
        tempArticles = homeArticles[j];
        break;
      }
    }
    retArticles.push(tempArticles);
  }
  return retArticles;
}

exports.index = function(req, res) {
  var options = {
    perPage: 10,
    page: 0,
    sort: {
      'index': 1
    }
  };

  var userOptions = {
    perPage: 6,
    page: 0
  };

  HomeArticle.list(options, function (err, homeArticles) {
    if (err) return res.render('500');
    User.populate(homeArticles, {
      path: 'article.user'
    }, function(err, homeArticles) {
      homeArticles = _fillHomeArticles(homeArticles);
      User.list(userOptions, function(err, users) {
        res.render('demo/index', {
          title: 'Home',
          homeArticles: homeArticles,
          users: users,
          isHome: true
        });
      });
    });
  });
}