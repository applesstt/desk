'use strict';

var _basePaginations = function(scope, resource, success) {
  success = typeof success === 'function' ? success : function() {};
  scope.wrapData = resource.query(success);
  scope.maxSize = 5;
  scope.pageChanged = function() {
    scope.wrapData = resource.query({
      page: scope.wrapData.page,
      perPage: scope.wrapData.perPage
    }, success);
  }
}

var _userArticles = function(scope, resource) {
  return function() {
    angular.forEach(scope.wrapData.users, function(user, index) {
      scope.wrapData.users[index].wrapData = resource.get({
        page: 1,
        perPage: 5,
        userId: user._id
      });
    })
  }
}

var _toggleRootNav = function(rootScope, name) {
  var navs = ['Users', 'Admins', 'HomeArticles', 'HomeStars', 'Articles', 'Comments'];
  for(var i = 0; i < navs.length; i++) {
    var fullName = 'nav' + navs[i] + 'Sel';
    rootScope[fullName] = (name === navs[i] && true);
  }
}
/* Controllers */

function UserCtrl($scope, $rootScope, SuperUser, SuperArticle) {
  _basePaginations($scope, SuperUser, _userArticles($scope, SuperArticle));
  _toggleRootNav($rootScope, 'Users');

  var _setProperty = function(index, property, flag) {
    flag = flag && true;
    var user = $scope.wrapData.users[index];
    user[property] = flag;
    user._csrf = $scope._csrf;
    SuperUser.update(user, function(data) {
      $scope.wrapData.users[index] = data.user;
    });
  }

  $scope.setAdmin = function(index, flag) {
    _setProperty(index, 'isAdmin', flag);
  }

  $scope.setStar = function(index, flag) {
    _setProperty(index, 'isStar', flag);
  }

  $scope.delUser = function(index, flag) {
    _setProperty(index, 'isDel', flag);
  }
}

function AdminCtrl($scope, $rootScope, SuperAdmin, SuperArticle) {
  _basePaginations($scope, SuperAdmin, _userArticles($scope, SuperArticle));
  _toggleRootNav($rootScope, 'Admins');

  var _setProperty = function(index, property, flag) {
    flag = flag && true;
    var user = $scope.wrapData.users[index];
    user[property] = flag;
    user._csrf = $scope._csrf;
    SuperAdmin.update(user, function(data) {
      $scope.wrapData.users[index] = data.user;
      if(property === 'isAdmin' && !flag) {
        $scope.wrapData.users.splice(index, 1);
      }
    });
  }

  $scope.setSuper = function(index, flag) {
    _setProperty(index, 'isSuperAdmin', flag);
  }

  $scope.setNormalUser = function(index) {
    _setProperty(index, 'isAdmin', false);
  }
}

function ArticleCtrl($scope, $rootScope, SuperArticle, superFactory) {
  _basePaginations($scope, SuperArticle);
  $scope.hasBriefImg = superFactory.hasBriefImg;
  _toggleRootNav($rootScope, 'Articles');

  $scope.setShow = function(index, flag) {
    var article = $scope.wrapData.articles[index];
    article._csrf = $scope._csrf;
    article.checked = true;
    article.show = flag;
    SuperArticle.update(article, function(data) {
      $scope.wrapData.articles[index] = data.article;
    })
  };
}

function CommentCtrl($scope, $rootScope, SuperComment, superFactory) {
  _basePaginations($scope, SuperComment);
  $scope.hasBriefImg = superFactory.hasBriefImg;
  _toggleRootNav($rootScope, 'Comments');

  $scope.setShow = function(index, commentId, flag) {
    var article = $scope.wrapData.articles[index];
    SuperComment.update({
      _id: article._id,
      commentId: commentId,
      flag: flag,
      _csrf: $scope._csrf
    }, function(data) {
      $scope.wrapData.articles[index] = data.article;
    })
  }
}

function SelArticlesInstanceCtrl($scope, $modalInstance, SuperArticle, superFactory, SuperHomeArticle, index) {
  _basePaginations($scope, SuperArticle);
  $scope.hasBriefImg = superFactory.hasBriefImg;
  $scope.select = function(selIndex) {
    var article = $scope.wrapData.articles[selIndex];
    var homeArticle = {
      index: index,
      article: article,
      _csrf: $scope._csrf
    };
    SuperHomeArticle.update(homeArticle, function(retData) {
      $modalInstance.close(retData.homeArticle);
    });
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

function HomeArticleCtrl($scope, $rootScope, SuperHomeArticle, $modal, superFactory) {
  _toggleRootNav($rootScope, 'HomeArticles');
  $scope.hasBriefImg = superFactory.hasBriefImg;

  $scope.wrapData = SuperHomeArticle.query();

  $scope.open = function(size, index) {
    var articlesInstance = $modal.open({
      templateUrl: '/super/to-sel-articles',
      controller: SelArticlesInstanceCtrl,
      size: size,
      resolve: {
        index: function() {
          return index;
        }
      }
    });

    articlesInstance.result.then(function (selectedArticle) {
      $scope.wrapData.homeArticles[index] = selectedArticle;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };
}

function SelStarsInstanceCtrl($scope, $modalInstance, SuperUser, superFactory, SuperHomeStar, index) {
  _basePaginations($scope, SuperUser);
  $scope.hasBriefImg = superFactory.hasBriefImg;
  $scope.select = function(selIndex) {
    var user = $scope.wrapData.users[selIndex];
    var homeStar = {
      index: index,
      user: user,
      _csrf: $scope._csrf
    };
    SuperHomeStar.update(homeStar, function(retData) {
      $modalInstance.close(retData.homeStar);
    });
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}


function HomeStarCtrl($scope, $rootScope, SuperHomeStar, $modal, superFactory) {
  _toggleRootNav($rootScope, 'HomeStars');
  $scope.hasBriefImg = superFactory.hasBriefImg;

  $scope.wrapData = SuperHomeStar.query();

  $scope.open = function(size, index) {
    var starsInstance = $modal.open({
      templateUrl: '/super/to-sel-stars',
      controller: SelStarsInstanceCtrl,
      size: size,
      resolve: {
        index: function() {
          return index;
        }
      }
    });

    starsInstance.result.then(function (selectedStar) {
      $scope.wrapData.homeStars[index] = selectedStar;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };
}