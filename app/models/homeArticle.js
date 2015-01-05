
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

/**
 * Article Schema
 */

var HomeArticleSchema = new Schema({
  index: {type: Number, default: 0},
  article: {type: Schema.ObjectId, ref: 'Article'}
});

/**
 * Methods
 */

HomeArticleSchema.methods = {

  /**
   * Remove comment
   */

  removeComment: function (commentId, cb) {
    var index = utils.indexof(this.comments, { id: commentId });
    if (~index) this.comments.splice(index, 1);
    else return cb('not found');
    this.save(cb);
  }
}

/**
 * Statics
 */

HomeArticleSchema.statics = {

  /**
   * List home articles
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};
    var sort = options.sort || {'index': 1};
    this.find(criteria)
      .sort(sort)
      .exec(cb);
  }
}

mongoose.model('HomeArticle', HomeArticleSchema);
