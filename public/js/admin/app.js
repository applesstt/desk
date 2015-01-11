var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var React = require('react');
var Articles = require('./components/Articles.react');
var Comments = require('./components/Comments.react');

var App = React.createClass({
  render: function(){
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <div className="list-group">
              <Link className="list-group-item" to="articles">文章审核</Link>
              <Link className="list-group-item" to="comments">评论审核</Link>
              <a className="list-group-item" href="/admin/home">首页文章</a>
              <a className="list-group-item" href="/admin/home">首页明星</a>
            </div>
          </div>
          <div className="col-md-10">
            <div>
              <RouteHandler/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var routes = (
  <Route path="/" handler={App}>
    <Route path="articles" name="articles" handler={Articles}/>
    <Route path="comments" name="comments" handler={Comments}/>
    <DefaultRoute handler={Articles}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('adminapp'));
});