var Common = (function() {

  var _initToolTip = function() {
    $('.tooltip-link').tooltip();
  };

  var _initTogglePostMulti = function() {
    $('.post-multy-action').click(function() {
      var _wrapDom = $(this).parents('.post-multy');
      var _shortDom = _wrapDom.find('.post-multy-short');
      var _normalDom = _wrapDom.find('.post-multy-normal');
      var _iconDom = $(this).find('.glyphicon');
      var _isShort = _iconDom.hasClass('glyphicon-chevron-down');
      _iconDom.removeClass('glyphicon-chevron-down glyphicon-chevron-up');
      var _iconCloneDom = _iconDom.clone();
      if(_isShort) {
        _shortDom.hide();
        _normalDom.show();
        $(this).text(' 收起').prepend(_iconCloneDom.addClass('glyphicon-chevron-up'));
      } else {
        _shortDom.show();
        _normalDom.hide();
        $(this).text(' 展开').prepend(_iconCloneDom.addClass('glyphicon-chevron-down'));
      }
    });
  };

  var init = function() {
    _initToolTip();
    _initTogglePostMulti();
  };

  return {
    init: init
  }
}).call(this);

$(function() {
  Common.init();
});