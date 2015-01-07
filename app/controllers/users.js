
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var utils = require('../../lib/utils');
var config = require('../../config/config');
var send = require('send');
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, userEmail) {
  var options = {
    criteria: { email : userEmail }
  };
  User.load(options, function (err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + userName));
    req.profile = user;
    next();
  });
};

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      console.log(err);
      return res.render('users/signup', {
        error: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      });
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
};

exports.update = function(req, res) {
  var user = req.user;

  // make sure no one changes the user
  delete req.body.user;

  user = extend(user, req.body);
  user.save(function(err) {
    if (!err) {
      return res.redirect('/users/' + user.email);
    }
    res.redirect('/users/' + user.email + '/edit');
  });
};

/**
 * to edit user page
 */
exports.edit = function(req, res) {
  res.render('users/edit', {
    user: req.profile
  });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile;
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 10;
  var options = {
    perPage: perPage,
    page: page,
    criteria: {
      show: true,
      user: user._id
    }
  };
  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    Article.count(options.criteria, function (err, count) {
      res.render('users/show', {
        title: user.name,
        author: user,
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage),
        hotArticles: req.hotArticles
      });
    });
  });
};

/**
 * Show avatar
 */
exports.avatar = function(req, res) {
  var _defaultAvatar = config.root + '/public/img/default_avatar.png';
  send(req, config.root + '/public/avatar/' + req.params.email + '.png')
    .on('error', function() {
      send(req, _defaultAvatar).pipe(res);
    })
    .pipe(res);
};

exports.signin = function (req, res) {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * demo page
 */
exports.demo = function(req, res) {
  res.render('demo/index', {
    title: 'demo'
  });
};

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up'
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};
