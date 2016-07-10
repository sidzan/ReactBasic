/** @jsx React.DOM */
'use strict'
require("script!./js_loads/jquery.js")
require("script!./js_loads/bootstrap.js")
require("script!./js_loads/underscore.js")

var ReactDOM = require('react-dom')
var React = require('react')
var Index = require('./components/index')
var createStore = require("redux").createStore
var applyMiddleware = require("redux").applyMiddleware
var Provider = require("react-redux").Provider
var thunkMiddleware = require('redux-thunk').default
var reducer = require("./reducers")
var actions = require("./actions")

var createStoreWithMiddleware=applyMiddleware(thunkMiddleware)(createStore);
var store=createStoreWithMiddleware(reducer);

var user_id=parseInt(utils.get_cookie('user_id'));
if (user_id) {
    store.dispatch(actions.load_user_data());
    store.dispatch(actions.load_time_sheet());
}
ReactDOM.render( <Provider store={store}><Index /></Provider> , document.getElementById('content'))
