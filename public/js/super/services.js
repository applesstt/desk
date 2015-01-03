var superUserServices = angular.module('superUserServices', ['ngResource']);

superUserServices.factory('SuperUser', ['$resource',
  function($resource){
    return $resource('/super/users', {}, {
      query: {method:'GET', params:{page: 1}, isArray:true}
    });
  }]);