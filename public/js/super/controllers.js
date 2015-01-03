'use strict';

/* Controllers */

function UserCtrl($scope, SuperUsers) {
  $scope.wrapData = SuperUsers.get({});

  $scope.maxSize = 5;

  $scope.pageChanged = function() {
    $scope.wrapData = SuperUsers.get({
      page: $scope.wrapData.page,
      perPage: $scope.wrapData.perPage
    });
  }

}

function AdminCtrl($scope, SuperAdmins) {
  $scope.wrapData = SuperAdmins.get({});
  $scope.maxSize = 5;
  $scope.pageChanged = function() {
    $scope.wrapData = SuperAdmins.get({
      page: $scope.wrapData.page,
      perPage: $scope.wrapData.perPage
    })
  }
}

function HomeArticlesCtrl($scope) {

}

function HomeStarsCtrl($scope) {

}

function ArticleCtrl($scope, SuperArticles, superFactory) {
  $scope.wrapData = SuperArticles.get({});
  $scope.maxSize = 5;
  $scope.pageChanged = function() {
    $scope.wrapData = SuperArticles.get({
      page: $scope.wrapData.page,
      perPage: $scope.wrapData.perPage
    })
  }
  $scope.hasBriefImg = superFactory.hasBriefImg;
}

function CommentCtrl($scope, SuperComments, superFactory) {
  $scope.wrapData = SuperComments.get({});
  $scope.maxSize = 5;
  $scope.pageChanged = function() {
    $scope.wrapData = SuperComments.get({
      page: $scope.wrapData.page,
      perPage: $scope.wrapData.perPage
    })
  }
  $scope.hasBriefImg = superFactory.hasBriefImg;
}