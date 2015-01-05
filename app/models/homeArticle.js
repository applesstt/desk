
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

HomeArticleSchema.methods = {}

/**
 * Statics
 */

HomeArticleSchema.statics = {

  findByIndex: function(options, cb) {
    var criteria = options.criteria || {};
    this.findOne(criteria)
      .populate('article')
      .exec(cb);
  },

  /**
   * List home articles
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};
    var sort = options.sort || {'index': 1};
    this.find(criteria)
      .sort(sort)
      .populate('article')
      .exec(cb);
  }
}

mongoose.model('HomeArticle', HomeArticleSchema);
