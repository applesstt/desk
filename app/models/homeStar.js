
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

var HomeStarSchema = new Schema({
  index: {type: Number, default: 0},
  user: {type: Schema.ObjectId, ref: 'User'}
});

/**
 * Methods
 */

HomeStarSchema.methods = {}

/**
 * Statics
 */

HomeStarSchema.statics = {

  findByIndex: function(options, cb) {
    var criteria = options.criteria || {};
    this.findOne(criteria)
      .populate('user')
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
      .populate('user')
      .exec(cb);
  }
}

mongoose.model('HomeStar', HomeStarSchema);
