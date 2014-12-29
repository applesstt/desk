var PersonSet = (function() {

  var _coords = '', _srcImgPath = '', _srcImgName = '';

  var _setCoords = function(c) {
    _coords = [c.w, c.h, c.x, c.y];
  }

  var _initUploadImg = function() {
    $('.edit-user-img-btn .btn').click(function() {
      $(this).parent().find('input').trigger('click');
    });
    $('.edit-user-img-btn input').change(function() {
      $('#upload-form').ajaxSubmit({
        url: '/images',
        type: 'post',
        dataType: 'json',
        success: function(result) {
          if(result) {
            _srcImgName = result.image + '.580.png.200.png';
            _srcImgPath = result.base_path;
            var imagePath200 = 'http://' + location.host + _srcImgPath + _srcImgName;
            $('#image-200').attr('src', imagePath200).Jcrop({
              onChange:   _setCoords,
              onSelect:   _setCoords,
              aspectRatio: 1,
              setSelect: [10,0,180,180]
            });
            $('#resize-user-img-btn').trigger('click');
          }
        }
      })
    })
  }

  var _initCropImg = function() {
    $('#crop-image').click(function() {
      $('#upload-form').ajaxSubmit({
        url: '/cropUserImage',
        type: 'post',
        dataType: 'json',
        data: {
          srcImgPath: _srcImgPath,
          srcImgName: _srcImgName,
          coords: _coords
        },
        success: function(result) {
          var userAvatar = $('#user-avatar-show').attr('src');
          $('#user-avatar-show').attr('src', userAvatar + '?r=' + Math.random());
          $('#resize-user-img-dialog').modal('hide');
          $('#user-avatar').val(result.base_path + result.image_name);
        }
      })
    });
  }

  var init = function() {
    _initUploadImg();
    _initCropImg();
  }

  return {
    init: init
  }
}).call(this);

$(function() {
  PersonSet.init();
})