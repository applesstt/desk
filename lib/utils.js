var moment = require('moment');
var config = require('../config/config');
var fs = require('fs');
var im = require('imagemagick');
var gm = require('gm');
var imageMagick = gm.subClass({imageMagick: true});
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
  var image_name = req.files['upload-image'].name;
  var image_path = req.files['upload-image'].path;
  if(image_name === '') {
    return console.log('You can upload any image, please retry!');
  }

  image_name = (new Date()).getTime() + '_' + image_name;
  var base_path = '/upload/images/';
  var base_name = config.root + '/public/upload/images/' + image_name;

  var target_path = base_name + '.png';
  try {
    fs.renameSync(image_path, target_path);
  } catch(e) {
    console.log(e);
  }

  var resize200 = function(callback) {
    resizeImage(target_path, base_name + '.200.png', 200, callback);
  };
  var resize580 = function(callback) {
    resizeImage(target_path, base_name + '.580.png', 580, callback);
  };
  var resizeSquare580 = function(callback) {
    resizeSquareImage(target_path, base_name + '.580_580.png', 580, callback);
  };

  async.parallel([resize200, resize580, resizeSquare580], function(err, results) {
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
  var userName = req.user.name;
  var avatarPath = '/avatar/';
  var srcImgPath = req.body.srcImgPath;
  var srcImgName = req.body.srcImgName;
  var coords = req.body.coords;
  var root = config.root + '/public';
  var imgName = userName + '.png';
  //convert rose: -crop 40x30+40+30  crop_br.gif
  var args = [root + srcImgPath + srcImgName, '-crop', coords,
    root + avatarPath + imgName];
  im.convert(args, function(err) {
    if(err) return console.log(err);
    console.log('Crop account img path: ' + root + avatarPath + userName);
    res.send({
      base_path: avatarPath,
      image_name: userName
    });
  });
}