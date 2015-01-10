var React = require('react');
var CommentAction = require('../actions/CommentActions');

var CommentShow = React.createClass({

  _check: function(flag) {
    CommentAction.checkComment(this.props.article, this.props.comment, flag);
  },

  _checkSuccess: function() {
    this._check(true);
  },

  _checkFailure: function() {
    this._check(false);
  },

  render: function(){
    var comment = this.props.comment;

    var action = <div className="text-right">
      <a href="javascript:{}" onClick={this._checkSuccess} className="btn btn-success btn-sm">评论合格</a>
    &nbsp;&nbsp;&nbsp;&nbsp;
      <a href="javascript:{}" onClick={this._checkFailure} className="btn btn-danger btn-sm">评论不合格</a>
    </div>;

    if(comment.checked) {
      action = comment.show ?
        <p className="text-right">
          <span className="text-success">已通过</span>
        </p> :
        <p className="text-right">
          <span className="text-danger">未通过</span>
        </p>;
    }

    return (
      <div className="panel">
        <div className="panel-body row">
          <div className="col-md-9">
            <img className="avatar-min" src={"/avatar/" + comment.user.email} />
            <a href={"/users/" + comment.user.email} target="_blank">   {comment.user.name}</a>
              {comment.body}
          </div>
          <div className="col-md-3">
              {action}
          </div>
        </div>
      </div>
      );
  }
});

module.exports = CommentShow;