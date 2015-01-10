var React = require('react');
var ArticleItem = require('./ArticleItem.react');
var ArticleStore = require('../stores/ArticleStore');
var Bootpag = require('../lib/react-bootpag.react');

var loadArticlesState = function(self, page) {
  ArticleStore.getAll(page, function(result) {
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

var Articles = React.createClass({

  getInitialState: function() {
    var self = this;
    var _pageCallback = function(states, pageNumber) {
      loadArticlesState(self, pageNumber);
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
    loadArticlesState(this);
    ArticleStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ArticleStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(loadArticlesState(this));
  },

  render: function(){

    var articles = [];
    var settings = this.state.settings;

    this.state.articles.forEach(function(article) {
      articles.push(<ArticleItem key={article._id} article={article} />);
    })

    return (
      <div>
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
        <div className="clearfix">
          <Bootpag settings={settings} />
        </div>
      </div>
    )
  }
});

module.exports = Articles;