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

function ArticleCtrl($scope, $http) {
  $http.get('/super/articles').
    success(function(data, status, headers, config) {
      $scope.articles = data.articles;
    });
  $scope.hasBriefImg = function(img) {
    return img !== '' && true;
  }
}

function CommentCtrl($scope, $http) {
  $http.get('/super/comments').
    success(function(data, status, headers, config) {
      $scope.articles = data.articles;
    })
  $scope.hasBriefImg = function(img) {
    return img !== '' && true;
  }
}