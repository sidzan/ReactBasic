React = require("react");

var Loading=React.createClass({
    render() {
        return <p><img src='/static/img/spinner.gif'/> Loading...</p>
    }
});

module.exports=Loading;
