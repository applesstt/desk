/**
 * super users services
 */
angular.module('superUserServices', ['ngResource']).factory('SuperUser', ['$resource',
  function($resource){
    return $resource('/super/user/:userId', {userId: '@_id'}, {
      query: {method: 'GET', isArray: false},
      update: {method: 'PUT'}
    });
  }]);

/**
 * super admins services
 */
angular.module('superAdminsServices', ['ngResource']).factory('SuperAdmins', ['$resource',
  function($resource) {
    return $resource('/super/user/:userId', {userId: '@_id'}, {
      query: {method: 'GET', isArray: false, url: '/super/admins'},
      update: {method: 'PUT'}
    })
  }])

/**
 * super articles services
 */
angular.module('superArticlesServices', ['ngResource']).factory('SuperArticles', ['$resource',
  function($resource) {
    return $resource('/super/articles', {}, {
      query: {method: 'GET', isArray: false}
    })
  }])

/**
 * super comments services
 */
angular.module('superCommentsServices', ['ngResource']).factory('SuperComments', ['$resource',
  function($resource) {
    return $resource('/super/comments', {}, {
      query: {method: 'GET', isArray: false}
    })
  }])