
var AdminDispatcher = require('../dispatcher/AdminDispatcher');
var EventEmitter = require('events').EventEmitter;
var AdminConstants = require('../constants/AdminConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _articles = [];

var _csrf = $('#admin_csrf').val();

var ArticleStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function(page, callback) {
    var page = typeof page === 'undefined' ? 1 : page;
    $.ajax({
      url: '/admin/article',
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

var updateCheck = function(article, flag) {
  article.checked = true;
  article.show = flag && true;
  article._csrf = _csrf;
  $.ajax({
    url: '/admin/article/' + article._id,
    method: 'PUT',
    data: article,
    success: function(result) {
      ArticleStore.emitChange();
    }
  })
}

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

module.exports = ArticleStore;