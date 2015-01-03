'use strict';

var _basePaginations = function(scope, resource, success) {
  success = typeof success === 'function' ? success : function() {};
  scope.wrapData = resource.get({}, success);
  scope.maxSize = 5;
  scope.pageChanged = function() {
    scope.wrapData = resource.get({
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
/* Controllers */

function UserCtrl($scope, SuperUsers, SuperArticles) {
  _basePaginations($scope, SuperUsers, _userArticles($scope, SuperArticles));
}

function AdminCtrl($scope, SuperAdmins, SuperArticles) {
  _basePaginations($scope, SuperAdmins, _userArticles($scope, SuperArticles));
}

function HomeArticlesCtrl($scope) {

}

function HomeStarsCtrl($scope) {

}

function ArticleCtrl($scope, SuperArticles, superFactory) {
  _basePaginations($scope, SuperArticles);
  $scope.hasBriefImg = superFactory.hasBriefImg;
}

function CommentCtrl($scope, SuperComments, superFactory) {
  _basePaginations($scope, SuperComments);
  $scope.hasBriefImg = superFactory.hasBriefImg;
}