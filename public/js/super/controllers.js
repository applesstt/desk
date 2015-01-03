'use strict';

/* Controllers */

function UserCtrl($scope, SuperUsers) {
  $scope.wrapData = SuperUsers.get({});

  $scope.maxSize = 5;

  $scope.pageChanged = function() {
    $scope.wrapData = SuperUsers.get({
      page: $scope.wrapData.page,
      perPage: $scope.wrapData.perPage
    });
  }

}

function AdminCtrl($scope, SuperAdmins) {
  $scope.wrapData = SuperAdmins.get({});
  $scope.maxSize = 5;
  $scope.pageChanged = function() {
    $scope.wrapData = SuperAdmins.get({
      page: $scope.wrapData.page,
      perPage: $scope.wrapData.perPage
    })
  }
}

function HomeArticlesCtrl($scope) {

}

function HomeStarsCtrl($scope) {

}

function ArticleCtrl($scope, $http, superFactory) {
  $http.get('/super/articles').
    success(function(data, status, headers, config) {
      $scope.articles = data.articles;
    });
  $scope.hasBriefImg = superFactory.hasBriefImg;
}

function CommentCtrl($scope, $http, superFactory) {
  $http.get('/super/comments').
    success(function(data, status, headers, config) {
      $scope.articles = data.articles;
    })
  $scope.hasBriefImg = superFactory.hasBriefImg;
}