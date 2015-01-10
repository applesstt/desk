var AdminDispatcher = require('../dispatcher/AdminDispatcher');
var AdminConstants = require('../constants/AdminConstants');

var ArticleActions = {
  checkArticle: function(article, flag) {
    AdminDispatcher.dispatch({
      actionType: AdminConstants.ARTICLE_CHECK,
      article: article,
      flag: flag
    });
  }
}

module.exports = ArticleActions;