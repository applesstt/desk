var React = require('react');
var ArticleShow = require('./ArticleShow.react');
var CommentShow = require('./CommentShow.react');

var CommentItem = React.createClass({

  render: function(){
    var article = this.props.article;
    var comments = [];

    article.comments.map(function(comment) {
      comments.push(
        <CommentShow comment={comment} article={article}/>
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