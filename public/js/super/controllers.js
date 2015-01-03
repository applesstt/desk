'use strict';

var _basePaginations = function(scope, resource) {
  scope.wrapData = resource.get({});
  scope.maxSize = 5;
  scope.pageChanged = function() {
    scope.wrapData = resource.get({
      page: scope.wrapData.page,
      perPage: scope.wrapData.perPage
    });
  }
}

/* Controllers */

function UserCtrl($scope, SuperUsers) {
  _basePaginations($scope, SuperUsers);
}

function AdminCtrl($scope, SuperAdmins) {
  _basePaginations($scope, SuperAdmins);
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