var moment = require('moment');
var config = require('../config/config');
var fs = require('fs');
var im = require('imagemagick');
var async = require('async');

/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function (errors) {
  var keys = Object.keys(errors)
  var errs = []

  // if there is no validation error, just display a generic error
  if (!keys) {
    return ['Oops! There was an error']
  }

  keys.forEach(function (key) {
    if (errors[key]) errs.push(errors[key].message)
  })

  return errs
}

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

exports.indexof = function (arr, obj) {
  var index = -1; // not found initially
  var keys = Object.keys(obj);
  // filter the collection with the given criterias
  var result = arr.filter(function (doc, idx) {
    // keep a counter of matched key/value pairs
    var matched = 0;

    // loop over criteria
    for (var i = keys.length - 1; i >= 0; i--) {
      if (doc[keys[i]] === obj[keys[i]]) {
        matched++;

        // check if all the criterias are matched
        if (matched === keys.length) {
          index = idx;
          return idx;
        }
      }
    };
  });
  return index;
}

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

exports.findByParam = function (arr, obj, cb) {
  var index = exports.indexof(arr, obj)
  if (~index && typeof cb === 'function') {
    return cb(undefined, arr[index])
  } else if (~index && !cb) {
    return arr[index]
  } else if (!~index && typeof cb === 'function') {
    return cb('not found')
  }
  // else undefined is returned
}

/**
 * Format datetime to fromNow by moment.js
 */
exports.fromNow = function(date) {
  moment.locale('zh-cn');
  return moment(date).fromNow();
}

/**
 * Resize image by set width
 */
var resizeImage = function(srcPath, dstPath, width, callback) {
  var imParams = {
    srcPath: srcPath,
    dstPath: dstPath,
    width: width
  };

  im.resize(imParams, function(err, stdout, stderr) {
    if(err) {
      callback(err);
    } else {
      console.log('Resize ' + dstPath + ' to ' + width + 'px width image!');
      callback(null, width);
    }
  });
}

exports.resizeImage = resizeImage;


/**
 * Upload image and return local image url
 */
exports.uploadImage = function(req, res) {
  var image_name = req.files['upload-image'].name;
  var image_path = req.files['upload-image'].path;
  if(image_name === '') {
    return console.log('You can upload any image, please retry!');
  }

  image_name = (new Date()).getTime() + '_' + image_name;
  var base_path = '/upload/images/';
  var target_path = config.root + '/public/upload/images/' + image_name;
  var target_path_200 = config.root + '/public/upload/images/' + '200_' + image_name;
  var target_path_580 = config.root + '/public/upload/images/' + '580_' + image_name;
  try {
    fs.renameSync(image_path, target_path);
  } catch(e) {
    console.log(e);
  }
  async.parallel([function(callback) {
    resizeImage(target_path, target_path_200, 200, callback);
  }, function(callback) {
    resizeImage(target_path, target_path_580, 580, callback);
  }], function(err, results) {
    if(err) return console.log(err);
    res.send({
      base_path: base_path,
      image: image_name
    });
  });
}