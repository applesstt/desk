var config = require('../config/config');
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({imageMagick: true});
var async = require('async');
var moment = require('moment');
var mkpath = require('mkpath');

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
  imageMagick(srcPath)
    .resize(width)
    .write(dstPath, function(err) {
    if(err) {
      callback(err);
    } else {
      console.log('Resize ' + dstPath + ' to ' + width + 'px width image by gm!');
      callback(null, width);
    }
  });
}

exports.resizeImage = resizeImage;

var resizeSquareImage = function(srcPath, dstPath, size, callback) {
  imageMagick(srcPath)
    .resize(size, size, '^')
    .gravity('Center')
    .crop(size, size, 0, 0)
    .write(dstPath, function(err) {
      if(err) {
        callback(err);
      } else {
        console.log('Resize square ' + dstPath + ' to ' + size + 'px size image by gm!');
        callback(null, size);
      }
    });
}


/**
 * Upload image and return local image url
 */
exports.uploadImage = function(req, res) {
  var userEmail = req.user.email;
  var image_name = req.files['upload-image'].name;
  var image_path = req.files['upload-image'].path;
  if(image_name === '') {
    return console.log('You can upload any image, please retry!');
  }

  var base_path = '/upload/images/' + userEmail + '/' + moment().format('YYYYMMDD') + '/';
  var real_path = config.root + '/public' + base_path;
  image_name = (new Date()).getTime() + '_' + image_name;

  // check and mkdir path -p
  mkpath.sync(real_path, 0777);

  var base_name = real_path + image_name;
  var target_path = base_name + '.png';
  try {
    fs.renameSync(image_path, target_path);
  } catch(e) {
    console.log(e);
  }

  /**
   * xxx.580.png (580 * auto)
   * xxx.580.png.200.png (200 * auto)
   * xxx.580.png.square.png (580 * 580)
   */
  var baseResizeImg = base_name + '.580.png';
  var resize200 = function(callback) {
    resizeImage(target_path, baseResizeImg + '.200.png', 200, callback);
  };
  var resizeSquare200 = function(callback) {
    resizeSquareImage(target_path, baseResizeImg + '.200.square.png', 200, callback);
  }
  var resize580 = function(callback) {
    resizeImage(target_path, baseResizeImg, 580, callback);
  };
  var resizeSquare580 = function(callback) {
    resizeSquareImage(target_path, baseResizeImg + '.square.png', 580, callback);
  };

  async.parallel([resize200, resizeSquare200, resize580, resizeSquare580], function(err, results) {
    if(err) return console.log(err);
    res.send({
      base_path: base_path,
      image: image_name
    });
  });
}

/**
 * Crop user image
 */
exports.cropUserImage = function(req, res) {
  var userEmail = req.user.email;
  var avatarPath = '/avatar/';
  var coords = req.body.coords;
  var root = config.root + '/public';

  var srcImg = root + req.body.srcImgPath + req.body.srcImgName;
  var dstImg = root + avatarPath + userEmail + '.png';

  if(coords.length < 4) return console.log('Input coords length less than 4, please check it!');
  imageMagick(srcImg)
    .crop(coords[0], coords[1], coords[2], coords[3])
    .write(dstImg, function(err) {
      if(err) return console.log(err);
      console.log('Crop account img by gm and path: ' + root + avatarPath + userEmail);
      res.send({
        base_path: avatarPath,
        image_name: userEmail
      });
    });
}