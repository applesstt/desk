var React = require('react');

var ArticleShow = React.createClass({
  render: function(){
    var article = this.props.article;

    return (
      <p>
        <a className="h4" href={"/articles/" +article._id} target="_blank">
          {article.title}
        </a>
        <div className="post-short">
          <div className="post-short-right">
            {article.brief.img !== '' ?
              <img src={article.brief.img + ".200.square.png"} /> :
              null}
          </div>
          {article.brief.text}
        </div>
      </p>
    );
  }
});

module.exports = ArticleShow;