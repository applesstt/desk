
var AdminDispatcher = require('../dispatcher/AdminDispatcher');
var EventEmitter = require('events').EventEmitter;
var AdminConstants = require('../constants/AdminConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _articles = [];

var _csrf = $('#admin_csrf').val();

var CommentStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getArticles: function(page, callback) {
    var page = typeof page === 'undefined' ? 1 : page;
    $.ajax({
      url: '/admin/commentsInArticle',
      method: 'GET',
      data: {
        page: page
      },
      success: function(result) {
        callback(result);
      }
    })
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

var updateCheck = function(article, comment, flag) {
  $.ajax({
    url: '/admin/commentsInArticle/' + article._id,
    method: 'PUT',
    data: {
      commentId: comment._id,
      _csrf: _csrf,
      flag: flag
    },
    success: function(result) {
      CommentStore.emitChange();
    }
  })
}


// Register callback to handle all updates
AdminDispatcher.register(function(action) {
  switch(action.actionType) {
    case AdminConstants.COMMENT_CHECK:
      updateCheck(action.article, action.comment, action.flag);
      break;

    default:
    // no op
  }
});

module.exports = CommentStore;