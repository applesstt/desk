var React = require('react');
var ArticleItem = require('./ArticleItem.react');
var ArticleStore = require('../stores/ArticleStore');

var loadArticlesState = function(self) {
  ArticleStore.getAll(function(articles) {
    if(self.isMounted()) {
      self.setState({
        articles: articles
      })
    }
  })
}

var Articles = React.createClass({

  getInitialState: function() {
    return {
      articles: []
    };
  },

  componentDidMount: function() {
    loadArticlesState(this);
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(loadArticlesState());
  },

  render: function(){

    var articles = [];

    this.state.articles.forEach(function(article) {
      articles.push(<ArticleItem key={article._id} article={article} />);
    })

    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>作者</th>
              <th>文章</th>
              <th className="text-center">操作</th>
            </tr>
          </thead>
          <tbody>{articles}</tbody>
        </table>
      </div>
    )
  }
});

module.exports = Articles;