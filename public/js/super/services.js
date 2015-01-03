/**
 * super users services
 */
angular.module('superUsersServices', ['ngResource']).factory('SuperUsers', ['$resource',
  function($resource){
    return $resource('/super/users', {}, {
      query: {method: 'GET', params: {}, isArray: true}
    });
  }]);

/**
 * super admins services
 */
angular.module('superAdminsServices', ['ngResource']).factory('SuperAdmins', ['$resource',
  function($resource) {
    return $resource('/super/admins', {}, {
      query: {method: 'GET', params: {}, isArray: true}
    })
  }])

/**
 * super articles services
 */
angular.module('superArticlesServices', ['ngResource']).factory('SuperArticles', ['$resource',
  function($resource) {
    return $resource('/super/articles', {}, {
      query: {method: 'GET', params: {}, isArray: true}
    })
  }])

/**
 * super comments services
 */
angular.module('superCommentsServices', ['ngResource']).factory('SuperComments', ['$resource',
  function($resource) {
    return $resource('/super/comments', {}, {
      query: {method: 'GET', params: {}, isArray: true}
    })
  }])