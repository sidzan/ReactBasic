/** @jsx React.DOM */
'use strict'
require("script!./js_loads/jquery.js")
require("script!./js_loads/bootstrap.js")
require("script!./js_loads/underscore.js")

var ReactDOM = require('react-dom') // To create a virutal DOM ( react standard) . include once in the main start file.
var React = require('react') // required in all files
var Index = require('./components/index') // Call for Routing
var createStore = require("redux").createStore // Storing in Browser
var applyMiddleware = require("redux").applyMiddleware // Storing in Browser
var thunkMiddleware = require('redux-thunk').default // storing 
var Provider = require("react-redux").Provider // bind the whole website
var reducer = require("./reducers")
var actions = require("./actions")

var createStoreWithMiddleware=applyMiddleware(thunkMiddleware)(createStore);
var store=createStoreWithMiddleware(reducer);

var user_id=parseInt(utils.get_cookie('user_id'));
if (user_id) {
    store.dispatch(actions.load_user_data());
    store.dispatch(actions.load_time_sheet());
}
ReactDOM.render( <Provider store={store}>
                    <Index />
                </Provider> , document.getElementById('content'))
