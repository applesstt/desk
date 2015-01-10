var React = require('react');
var CommentItem = require('./CommentItem.react');
var CommentStore = require('../stores/CommentStore');

var loadArticlesWithCommentsState = function(self) {
  CommentStore.getArticles(function(articles) {
    if(self.isMounted()) {
      self.setState({
        articles: articles
      })
    }
  })
}

var Comments = React.createClass({

  getInitialState: function() {
    return {
      articles: []
    };
  },

  componentDidMount: function() {
    loadArticlesWithCommentsState(this);
    CommentStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CommentStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(loadArticlesWithCommentsState(this));
  },

  render: function(){

    var articles = [];

    this.state.articles.forEach(function(article) {
      articles.push(<CommentItem key={article._id} article={article} />);
    })

    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>评论列表</th>
            </tr>
          </thead>
          <tbody>{articles}</tbody>
        </table>
      </div>
    )
  }
});

module.exports = Comments;