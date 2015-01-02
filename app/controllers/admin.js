
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

exports.superSub = function(req, res) {
  var sub = req.params.superSub;
  res.render('super/' + sub);
}

exports.index = function(req, res) {

}

var _fetchUsers = function(req, res, options) {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 20;
  options.page = page;
  options.perPage = perPage;

  User.list(options, function(err, users) {
    User.count().exec(function(err, count) {
      res.send({
        users: users,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

exports.getUsers = function(req, res) {
  var options = {}
  _fetchUsers(req, res, options);
}

exports.getAdmins = function(req, res) {
  var options = {
    criteria: {
      '$where': function() {
        return this.isAdmin === true && !(this.isSuperAdmin || false);
      }
    }
  };
  _fetchUsers(req, res, options);
}