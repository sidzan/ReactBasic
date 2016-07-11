/** @jsx React.DOM */
'use strict'

var React = require('react')
var Router=require('react-router').Router
var Route=require('react-router').Route
var IndexRoute=require('react-router').IndexRoute
var IndexRedirect=require('react-router').IndexRedirect
var Login = require('./login')
var Layout = require('./layout')
var Home = require('./home')
var history = require('react-router').browserHistory

var Index = React.createClass({
    render: function() {
        return <Router history={history}>
            <Route path="/" component={Layout}>
                <IndexRedirect to="/login" />
                <Route path="login" component={Login}/>
                <Route path="home" component={Home}/>
            </Route>
        </Router>
    },
})

module.exports = Index;

