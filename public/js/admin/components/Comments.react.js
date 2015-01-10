var React = require('react');
var CommentItem = require('./CommentItem.react');
var CommentStore = require('../stores/CommentStore');
var Bootpag = require('../lib/react-bootpag.react');

var loadArticlesWithCommentsState = function(self, page) {
  CommentStore.getArticles(page, function(result) {
    if(self.isMounted()) {
      var _settings = self.state.settings;
      _settings.total = result.pages;
      _settings.maxVisible = result.pages;
      _settings.page = result.page;
      self.setState({
        articles: result.articles,
        settings: _settings
      })
    }
  })
}

var Comments = React.createClass({

  getInitialState: function() {
    var self = this;
    var _pageCallback = function(states, pageNumber) {
      loadArticlesWithCommentsState(self, pageNumber);
    }
    return {
      articles: [],
      settings: {
        total: 1,
        page: 1,
        maxVisible: 10,
        nextCallback: _pageCallback,
        prevCallback: _pageCallback,
        nextText: null,
        prevText: null,
        increment: 3,
        href: 'javascript:{}',
        pageCallback: _pageCallback
      }
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
    var settings = this.state.settings;

    this.state.articles.forEach(function(article) {
      articles.push(<CommentItem key={article._id} article={article} />);
    })

    return (
      <div>
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
        <div className="clearfix">
          <Bootpag settings={settings} />
        </div>
      </div>
    )
  }
});

module.exports = Comments;