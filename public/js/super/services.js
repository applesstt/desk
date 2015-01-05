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
angular.module('superAdminServices', ['ngResource']).factory('SuperAdmin', ['$resource',
  function($resource) {
    return $resource('/super/user/:userId', {userId: '@_id'}, {
      query: {method: 'GET', isArray: false, url: '/super/admin'},
      update: {method: 'PUT'}
    })
  }])

/**
 * super articles services
 */
angular.module('superArticleServices', ['ngResource']).factory('SuperArticle', ['$resource',
  function($resource) {
    return $resource('/super/article/:articleId', {articleId: '@_id'}, {
      query: {method: 'GET', isArray: false},
      update: {method: 'PUT'}
    })
  }])

/**
 * super comments services
 */
angular.module('superCommentServices', ['ngResource']).factory('SuperComment', ['$resource',
  function($resource) {
    return $resource('/super/commentsInArticle/:articleId', {articleId: '@_id'}, {
      query: {method: 'GET', isArray: false},
      update: {method: 'PUT'}
    })
  }])