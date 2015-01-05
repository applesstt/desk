'use strict';

// Declare app level module which depends on filters, and services
angular.module('superApp', ['ngRoute', 'ui.bootstrap', 'superUserServices', 'superAdminServices', 'superArticleServices', 'superCommentsServices']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/super/to-users',
        controller: UserCtrl
      }).
      when('/toAdmins', {
        templateUrl: '/super/to-admins',
        controller: AdminCtrl
      }).
      when('/toHomeArticles', {
        templateUrl: '/super/to-home-articles',
        controller: HomeArticlesCtrl
      }).
      when('/toHomeStars', {
        templateUrl: '/super/to-home-stars',
        controller: HomeStarsCtrl
      }).
      when('/toArticles', {
        templateUrl: '/super/to-articles',
        controller: ArticleCtrl
      }).
      when('/toComments', {
        templateUrl: '/super/to-comments',
        controller: CommentCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }]).
  factory('superFactory', function() {
    var service = {};
    service.hasBriefImg = function(img) {
      return img !== '' && true;
    };
    return service;
  });