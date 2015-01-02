'use strict';

/* Controllers */

function UserCtrl($scope, $http) {
  $http.get('/super/users').
    success(function(data, status, headers, config) {
      $scope.users = data.users;
    });
}

function AdminCtrl($scope, $http) {
  $http.get('/super/admins').
    success(function(data, status, headers, config) {
      $scope.users = data.users;
    });
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