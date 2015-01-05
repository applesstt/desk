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

function UserCtrl($scope, $rootScope, SuperUser, SuperArticles) {
  _basePaginations($scope, SuperUser, _userArticles($scope, SuperArticles));
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

function AdminCtrl($scope, $rootScope, SuperAdmins, SuperArticles) {
  _basePaginations($scope, SuperAdmins, _userArticles($scope, SuperArticles));
  _toggleRootNav($rootScope, 'Admins');
}

function HomeArticlesCtrl($scope, $rootScope) {
  _toggleRootNav($rootScope, 'HomeArticles');
}

function HomeStarsCtrl($scope, $rootScope) {
  _toggleRootNav($rootScope, 'HomeStars');
}

function ArticleCtrl($scope, $rootScope, SuperArticles, superFactory) {
  _basePaginations($scope, SuperArticles);
  $scope.hasBriefImg = superFactory.hasBriefImg;
  _toggleRootNav($rootScope, 'Articles');
}

function CommentCtrl($scope, $rootScope, SuperComments, superFactory) {
  _basePaginations($scope, SuperComments);
  $scope.hasBriefImg = superFactory.hasBriefImg;
  _toggleRootNav($rootScope, 'Comments');
}