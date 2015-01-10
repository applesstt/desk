var React = require('react');
var ArticleShow = require('./ArticleShow.react');

var CommentItem = React.createClass({

  _checkSuccess: function() {},
  _checkFailure: function() {},

  render: function(){
    var article = this.props.article;
    var comments = [];


    article.comments.forEach(function(comment) {
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

      comments.push(
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
      )
    });

    return (
      <tr>
        <td>
          <ArticleShow article={article}/>
          {comments}
        </td>
      </tr>
    );
  }
});

module.exports = CommentItem;