
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
  getArticles: function(callback) {
    $.ajax({
      url: '/admin/commentsInArticle',
      method: 'GET',
      success: function(result) {
        _articles = result.articles;
        callback(_articles);
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

// Register callback to handle all updates
AdminDispatcher.register(function(action) {
  switch(action.actionType) {
    case AdminConstants.ARTICLE_CHECK:
      updateCheck(action.article, action.flag);
      break;

    default:
    // no op
  }
});

module.exports = CommentStore;