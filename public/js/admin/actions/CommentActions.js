var AdminDispatcher = require('../dispatcher/AdminDispatcher');
var AdminConstants = require('../constants/AdminConstants');

var CommentActions = {
  checkComment: function(article, comment, flag) {
    AdminDispatcher.dispatch({
      actionType: AdminConstants.COMMENT_CHECK,
      article: article,
      comment: comment,
      flag: flag
    });
  }
}

module.exports = CommentActions;