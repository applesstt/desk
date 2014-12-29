
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var extend = require('util')._extend;

exports.index = function(req, res) {
  var options = {
    perPage: 10,
    page: 0,
    criteria: {
      '$where': function() {
        return this.brief.img !== '';
      }
    },
    sort: {
      'createdAt': 1
    }
  };

  var userOptions = {
    perPage: 6,
    page: 0
  };

  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    User.list(userOptions, function(err, users) {
      res.render('demo/index', {
        title: 'Home',
        articles: articles,
        users: users,
        isHome: true
      });
    });
  });
}