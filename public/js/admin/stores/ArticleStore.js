
var AdminDispatcher = require('../dispatcher/AdminDispatcher');
var EventEmitter = require('events').EventEmitter;
var AdminConstants = require('../constants/AdminConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _articles = [];

var ArticleStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getAll: function(callback) {
    $.ajax({
      url: '/admin/article',
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
  var text;

  switch(action.actionType) {
    case AdminConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);
      }
      ArticleStore.emitChange();
      break;

    default:
    // no op
  }
});

module.exports = ArticleStore;
