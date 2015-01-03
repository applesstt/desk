/**
 * super user services
 */
angular.module('superUsersServices', ['ngResource']).factory('SuperUsers', ['$resource',
  function($resource){
    return $resource('/super/users', {}, {
      query: {method: 'GET', params: {}, isArray: true}
    });
  }]);

angular.module('superAdminsServices', ['ngResource']).factory('SuperAdmins', ['$resource',
  function($resource) {
    return $resource('/super/admins', {}, {
      query: {method: 'GET', params: {}, isArray: true}
    })
  }])