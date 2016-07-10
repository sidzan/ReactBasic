/** @jsx React.DOM */
'use strict'
require("script!./js_loads/jquery.js")
require("script!./js_loads/bootstrap.js")
require("script!./js_loads/underscore.js")

var ReactDOM = require('react-dom')
var React = require('react')
var Router = require('./components/router')
var createStore = require("redux").createStore
var applyMiddleware = require("redux").applyMiddleware
var Provider = require("react-redux").Provider
var thunkMiddleware = require("redux-thunk")
var reducer = require("./reducers")
var actions = require("./actions")

var createStoreWithMiddleware=applyMiddleware(thunkMiddleware)(createStore);
var store=createStoreWithMiddleware(reducer);

var user_id=parseInt(localStorage.user_id);
if (user_id) {
    store.dispatch(actions.load_user_data());
}
ReactDOM.render( <Provider store={store}><Router/></Provider> , document.getElementById('content'))
