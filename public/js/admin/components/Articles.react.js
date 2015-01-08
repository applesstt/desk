var React = require('react');

var Articles = React.createClass({
  render: function(){
    return (
      <div>
        <ul>
          <li>老人与海</li>
          <li>黄金时代</li>
          <li>平凡的世界</li>
        </ul>
      </div>
    );
  }
});

module.exports = Articles;