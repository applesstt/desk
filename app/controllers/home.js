
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var HomeArticle = mongoose.model('HomeArticle');
var HomeStar = mongoose.model('HomeStar');
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

var _fillHomeStars = function(homeStars) {
  var retStars = [];
  for(var i = 0; i < 10; i++) {
    var tempStars = {
      index: i
    };
    for(var j = 0; j < homeStars.length; j++) {
      if(i === homeStars[j].index) {
        tempStars = homeStars[j];
        break;
      }
    }
    retStars.push(tempStars);
  }
  return retStars;
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
      HomeStar.list(userOptions, function(err, homeStars) {
        homeStars = _fillHomeStars(homeStars);
        res.render('demo/index', {
          title: 'Home',
          homeArticles: homeArticles,
          homeStars: homeStars,
          isHome: true
        });
      });
    });
  });
}