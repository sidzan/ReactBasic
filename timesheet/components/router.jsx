/** @jsx React.DOM */
'use strict'

var React = require('react')
var Router=require('react-router').Router
var Route=require('react-router').Route
var IndexRoute=require('react-router').IndexRoute
var IndexRedirect=require('react-router').IndexRedirect
var Login = require('./login')
var createBrowserHistory = require('history/lib/createBrowserHistory')
var history = createBrowserHistory()

var Router = React.createClass({
    render: function() {
        return <Router history={history}>
            <Route path="/" component={Layout}>
                <IndexRedirect to="/meals" />
                <Route path="login" component={Login}/>
            </Route>
        </Router>
    },
})

module.exports = Router;

