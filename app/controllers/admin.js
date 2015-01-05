
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
  var perPage = req.param('perPage') > 0 ? req.param('perPage') : 10;
  options.page = page;
  options.perPage = perPage;

  User.list(options, function(err, users) {
    User.count(options.criteria, function(err, count) {
      res.send({
        users: users,
        count: count,
        page: page + 1,
        perPage: perPage,
        pages: Math.ceil(count / perPage)
      })
    })
  })
}

exports.getUsers = function(req, res) {
  var options = {}
  _fetchUsers(req, res, options);
}

/**
 * Load temp user for next
 */
exports.loadUser = function(req, res, next, userId) {
  var options = {
    criteria: { _id : userId }
  };
  User.load(options, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + userName));
    req.tempUser = user;
    next();
  });
}

/**
 * Load temp article for next
 */
exports.loadArticle = function(req, res, next, articleId) {
  Article.load(articleId, function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('not found'));
    req.tempArticle = article;
    next();
  });
}

exports.updateUser = function(req, res) {
  var user = req.tempUser;
  var wrapData = user.wrapData;
  delete user.wrapData;
  delete user._csrf;
  user = extend(user, req.body);
  user.save(function(err) {
    if(err) {
      return res.send({
        message: 'Update user error!'
      });
    }
    user.wrapData = wrapData;
    res.send({
      user: user
    });
  })
}

exports.getAdmins = function(req, res) {
  var options = {
    criteria: {
      '$where': function() {
        return this.isAdmin || this.isSuperAdmin;
      }
    }
  };
  _fetchUsers(req, res, options);
}

exports.getArticles = function(req, res) {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = req.param('perPage') > 0 ? req.param('perPage') : 10;
  var options = {
    page: page,
    perPage: perPage,
    criteria: {}
  };
  var userId = req.param('userId');
  if(typeof userId !== 'undefined' && userId !== '') {
    options.criteria.user = req.param('userId');
  }
  Article.list(options, function(err, articles) {
    Article.count(options.criteria, function(err, count) {
      res.send({
        articles: articles,
        count: count,
        page: page + 1,
        perPage: perPage,
        pages: Math.ceil(count / perPage)
      })
    })
  });
}

exports.updateArticle = function(req, res) {
  var article = req.tempArticle;
  delete req.body._csrf;
  delete req.body.tags;
  delete req.body.comments;
  article = extend(article, req.body);
  article.save(function(err) {
    if(err) {
      return res.send({
        message: 'Update article error!'
      });
    }
    res.send({
      article: article
    });
  })
}

exports.getComments = function(req, res) {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = req.param('perPage') > 0 ? req.param('perPage') : 10;
  var criteria = {
    '$where': function() {
      return this.comments.length > 0 && true;
    }
  };
  var options = {
    page: page,
    perPage: perPage,
    criteria: criteria
  };
  Article.listAll(options, function(err, articles) {
    Article.count(criteria, function(err, count) {
      res.send({
        articles: articles,
        count: count,
        page: page + 1,
        perPage: perPage,
        pages: Math.ceil(count / perPage)
      })}
    )
  })
}