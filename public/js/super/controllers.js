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
  /*$scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };*/
}

function HomeArticlesCtrl($scope) {

}

function HomeStarsCtrl($scope) {

}

function ArticleCtrl($scope) {

}

function CommentCtrl($scope) {

}