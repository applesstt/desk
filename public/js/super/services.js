/**
 * super user services
 */
angular.module('superUsersServices', ['ngResource']).factory('SuperUsers', ['$resource',
  function($resource){
    return $resource('/super/users', {}, {
      query: {method:'GET', params:{page: 1}, isArray:true}
    });
  }]);