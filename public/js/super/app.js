'use strict';

// Declare app level module which depends on filters, and services
angular.module('superApp', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/users', {
        templateUrl: '/super/users',
        controller: UserCtrl
      }).
      when('/admins', {
        templateUrl: '/super/admins',
        controller: AdminCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);