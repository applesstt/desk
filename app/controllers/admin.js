
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

exports.superIndex = function(req, res) {
  res.render('super/index');
}

exports.superSub = function(req, res) {
  var sub = req.params.superSub;
  res.render('super/' + sub);
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

exports.updateComment = function(req, res) {
  var article = req.tempArticle;
  var commentId = req.body.commentId;
  var flag = req.body.flag;
  if(typeof flag === 'string') {
    flag = flag === 'true' && true;
  }
  flag = flag && true;
  if(typeof commentId === 'undefined' || commentId === '') {
    return res.send({
      message: 'You should input comment id!'
    });
  }
  article.checkComment(commentId, flag, function(err, article) {
    if(err) {
      return res.send({
        message: 'Check comment failure!'
      });
    }
    res.send({
      article: article
    })
  })
}

var _fillHomeArticles = function(list) {
  var retList = []
  for(var i = 0; i < 10; i++) {
    var tempObj = {
      index: i,
      isNull: true
    };
    for(var j = 0; j < list.length; j++) {
      if(list[j]['index'] === i) {
        tempObj = list[j];
        break;
      }
    }
    retList.push(tempObj);
  }
  return retList;
}

exports.getHomeArticles = function(req, res) {
  var options = {};
  HomeArticle.list(options, function(err, list) {
    if(err) {
      return res.send({
        message: 'Load home articles error!'
      })
    }
    User.populate(list, {
      path: 'article.user'
    }, function(err, list) {
      list = _fillHomeArticles(list);
      res.send({
        homeArticles: list
      })
    });
  })
}

exports.updateHomeArticles = function(req, res) {
  HomeArticle.findByIndex({
    criteria: {
      index: req.body.index
    }
  }, function(err, homeArticle) {
    if(homeArticle) {
      homeArticle.article = req.body.article;
    } else {
      homeArticle = new HomeArticle({
        index: req.body.index,
        article: req.body.article._id
      });
    }
    homeArticle.save(function(err, homeArticle) {
      if(err) {
        return res.send({
          err: err,
          message: 'Update home article error!'
        })
      }
      HomeArticle.findByIndex({
        criteria: {
          _id: homeArticle._id
        }
      }, function(err, homeArticle) {
        res.send({
          homeArticle: homeArticle
        })
      })
    })
  });
}

var _fillHomeStar = function(list) {
  var retList = []
  for(var i = 0; i < 6; i++) {
    var tempObj = {
      index: i,
      isNull: true
    };
    for(var j = 0; j < list.length; j++) {
      if(list[j]['index'] === i) {
        tempObj = list[j];
        break;
      }
    }
    retList.push(tempObj);
  }
  return retList;
}


exports.getHomeStars = function(req, res) {
  var options = {};
  HomeStar.list(options, function(err, list) {
    if(err) {
      return res.send({
        message: 'Load home stars error!'
      })
    }
    list = _fillHomeStar(list);
    res.send({
      homeStars: list
    })
  })
}

exports.updateHomeStars = function(req, res) {
  HomeStar.findByIndex({
    criteria: {
      index: req.body.index
    }
  }, function(err, homeStar) {
    if(homeStar) {
      homeStar.user = req.body.user;
    } else {
      homeStar = new HomeStar({
        index: req.body.index,
        user: req.body.user._id
      });
    }
    homeStar.save(function(err, homeStar) {
      if(err) {
        return res.send({
          err: err,
          message: 'Update home star error!'
        })
      }
      HomeStar.findByIndex({
        criteria: {
          _id: homeStar._id
        }
      }, function(err, homeStar) {
        res.send({
          homeStar: homeStar
        })
      })
    })
  });
}

// about admin manage

exports.index = function(req, res) {
  res.render('admin/index');
}

exports.home = function(req, res) {
  res.render('admin/home');
}