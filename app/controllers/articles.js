
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Article = mongoose.model('Article')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){
  var User = mongoose.model('User');

  Article.load(id, function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('not found'));
    req.article = article;
    next();
  });
};

/**
 * List
 */

exports.index = function (req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    Article.count().exec(function (err, count) {
      res.render('articles/index', {
        title: 'Articles',
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New article
 */

exports.new = function (req, res) {
  res.render('articles/new', {
    title: 'New Article',
    article: new Article({}),
    author: req.user,
    isNew: true
  });
};

/**
 * Edit an article
 */
exports.edit = function (req, res) {
  res.render('articles/new', {
    title: 'Edit ' + req.article.title,
    article: req.article,
    author: req.user
  });
};

var _validateAndSave = function(req, res, article, callback) {
  article.validate(function(err) {
    if(err) {
      req.flash('danger', err);
      return callback(err);
    }
    article.save(function(err) {
      if(err) {
        req.flash('danger', err);
        return callback(err);
      }
      callback();
    });
  })
};

/**
 * Create an article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);

  article.user = req.user;

  _validateAndSave(req, res, article, function(err) {
    if(!err) {
      return res.redirect('/articles/' + article._id);
    }
    res.render('articles/new', {
      title: 'New Article',
      article: article,
      author: req.user,
      isNew: true,
      message: req.flash('danger')
    });
  });
};

/**
 * Update article
 */
exports.update = function(req, res) {
  var article = req.article;

  // make sure no one changes the user
  delete req.body.user;

  article = extend(article, req.body);

  _validateAndSave(req, res, article, function(err) {
    if(err) {
      return res.reder('articles/' + article._id + '/edit', {
        title: 'Edit ' + article.title,
        article: article,
        author: req.user,
        message: req.flash('danger')
      });
    }
    return res.redirect('/articles/' + article._id);
  });

};

/**
 * Show
 */

exports.show = function (req, res){
  res.render('articles/article', {
    title: req.article.title,
    article: req.article,
    author: req.article.user
  });
};

/**
 * Delete an article
 */

exports.destroy = function (req, res){
  var article = req.article;
  article.remove(function (err){
    res.redirect('/users/' + req.user.email);
  });
};
