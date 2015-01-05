
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Imager = require('imager');
var config = require('config');

var imagerConfig = require(config.root + '/config/imager.js');
var utils = require('../../lib/utils');
var jsdom = require('jsdom');

var Schema = mongoose.Schema;

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',');
};

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
};

/**
 * Article Schema
 */

var ArticleSchema = new Schema({
  title: {type: String, default: '', trim: true},
  body: {type: String, default: '', trim: true},
  user: {type: Schema.ObjectId, ref: 'User'},
  comments: [{
    body: {type: String, default: ''},
    user: {type: Schema.ObjectId, ref: 'User'},
    show: {type: Boolean, default: true},
    checked: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
  }],
  category: {type: String, default: '', trim: true},
  tags: {type: [], get: getTags, set: setTags},
  show: {type: Boolean, default: true}, // true - user can see it  false - otherwise
  checked: {type: Boolean, default: false}, // true - has checked  false - wait checked
  brief: {
    img: {type: String, default: '', trim: true},
    text: {type: String, default: '', trim: true}
  },
  image: {
    cdnUri: String,
    files: []
  },
  createdAt: {type: Date, default: Date.now}
});

/**
 * virtual
 */
ArticleSchema.virtual('fromNow').get(function() {
  return utils.fromNow(this.createdAt);
});

/**
 * Validations
 */

ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');
ArticleSchema.path('category').required(true, 'Article category cannot be blank');

/**
 * Pre-save hook
 */
ArticleSchema.pre('save', function(next) {
  var self = this;
  jsdom.env(
    self.body,
    [config.root + "/public/lib/jquery/dist/jquery.min.js"],
    function(errors, window) {
      if(errors) {
        return next(errors);
      }
      var imgPath = '';
      window.$('img').each(function(index, img) {
        var src = window.$(img).attr('src');
        var lastStr = '.580.png';
        if(src.lastIndexOf(lastStr) === (src.length - lastStr.length)) {
          imgPath = src;
          return false;
        }
      });
      self.brief.img = imgPath;
      self.brief.text = window.$(window.document).text();
      console.log('Success filter img and text on brief!');
      next();
    }
  );
});

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3');
  var files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err);
  }, 'article');

  next();
});

/**
 * Methods
 */

ArticleSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  upAndSave: function(cb) {
    var self = this;
    this.validate(function (err) {
      if (err) return cb(err);
      self.save(cb);
    });
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {
    var notify = require('../mailer');

    this.comments.push({
      body: comment.body,
      user: user._id
    });

    if (!this.user.email) this.user.email = 'email@product.com';
    notify.comment({
      article: this,
      currentUser: user,
      comment: comment.body
    });

    this.save(cb);
  },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */

  removeComment: function (commentId, cb) {
    // mongoose will set _id to subArrays, you can set as id and get by _id
    // - by applesstt
    var index = utils.indexof(this.comments, { id: commentId });
    if (~index) this.comments.splice(index, 1);
    else return cb('not found');
    this.save(cb);
  },

  /**
   * Update comment
   */
  checkComment: function(commentId, flag, cb) {
    var index = utils.indexof(this.comments, { id: commentId });
    if (~index) {
      this.comments[index].checked = true;
      this.comments[index].show = flag;
    }
    else return cb('not found');
    this.save(cb);
  }
}

/**
 * Statics
 */

ArticleSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email city website des')
      .populate('comments.user')
      .exec(cb);
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};
    var sort = options.sort || {'createdAt': -1};
    this.find(criteria)
      .populate('user', 'name email')
      .sort(sort)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  },

  /**
   * list article contains comments and comment's user
   */
  listAll: function (options, cb) {
    var criteria = options.criteria || {};
    var sort = options.sort || {'createdAt': -1};
    this.find(criteria)
      .populate('user', 'name email')
      .populate('comments.user')
      .sort(sort)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }
}

mongoose.model('Article', ArticleSchema);
