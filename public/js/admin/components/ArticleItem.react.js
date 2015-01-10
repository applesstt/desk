var React = require('react');
var ArticleShow = require('./ArticleShow.react');
var ArticleActions = require('../actions/ArticleActions')

var ArticleItem = React.createClass({
  _check: function(flag) {
    ArticleActions.checkArticle(this.props.article, flag);
  },

  _checkSuccess: function() {
    this._check(true);
  },

  _checkFailure: function() {
    this._check(false);
  },

  render: function(){
    var article = this.props.article;

    var action = <div>
        <p>
          <a href="javascript:{}" onClick={this._checkSuccess} className="btn btn-success btn-sm">这篇文章很不错</a>
        </p>
        <p>
          <a href="javascript:{}" onClick={this._checkFailure} className="btn btn-danger btn-sm">这篇文章不合格</a>
        </p>
      </div>;
    if(article.checked) {
      action = article.show ?
        <p>
          <span className="text-success">已通过</span>
        </p> :
        <p>
          <span className="text-danger">未通过</span>
        </p>;
    }

    return (
      <tr>
        <td className="col-md-2">
          <img className="avatar-min" src={"/avatar/" + article.user.email} />
          <a href="javascript:{}">   {article.user.name}</a>
        </td>
        <td>
          <ArticleShow article={article} />
        </td>
        <td className="col-md-2 text-center">
          {action}
        </td>
      </tr>
    );
  }
});

module.exports = ArticleItem;