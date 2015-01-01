'use strict';

// Declare app level module which depends on filters, and services
angular.module('superApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/super/users',
        controller: UserCtrl
      }).
      when('/admins', {
        templateUrl: '/super/admins',
        controller: AdminCtrl
      }).
      when('/articles', {
        templateUrl: '/super/articles',
        controller: ArticleCtrl
      }).
      when('/comments', {
        templateUrl: '/super/comments',
        controller: CommentCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);