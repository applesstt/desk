
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var utils = require('../../lib/utils');
var config = require('../../config/config');
var send = require('send');

/**
 * Load
 */

exports.load = function (req, res, next, userName) {
  var options = {
    criteria: { name : userName }
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
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page,
    criteria: {
      user: user._id
    }
  };
  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    Article.count().exec(function (err, count) {
      res.render('user/show', {
        title: user.name,
        author: user,
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * Show avatar
 */
exports.avatar = function(req, res) {
  var _defaultAvatar = config.root + '/public/img/default_avatar.png';
  send(req, config.root + '/public/avatar/' + req.params.name + '.png')
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
 * Show login form
 */

exports.login = function (req, res) {
  res.render('user/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('user/signup', {
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
