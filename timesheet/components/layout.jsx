/** @jsx React.DOM */
'use strict'

var React = require('react')
var Navbar = require('react-bootstrap').Navbar
var Nav = require('react-bootstrap').Nav
var NavItem = require('react-bootstrap').NavItem
var MenuItem = require('react-bootstrap').MenuItem
var NavDropdown = require('react-bootstrap').NavDropdown
var connect = require("react-redux").connect
var actions=require("../actions");
var Layout = React.createClass({
	render: function() {
    		return <div>
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span> 
                  </button>
                  <a className="navbar-brand" href="#">REact</a>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                  <ul className="nav navbar-nav">
                    <li className="active"><a href="#">Netforce</a></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    {function (){
                        if (!this.props.user_data){
                            return <li><a href="#"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                        }
                        else{
                            return <li onClick={this.logout}><a href="#"><span className="glyphicon glyphicon-log-in"></span> Logout</a></li>
                        }
                    }.bind(this)()}
                  </ul>
                </div>
              </div>
            </nav>
            {this.props.children}
        </div>
	},

    logout: function(e) {
        e.preventDefault();
        this.props.dispatch(actions.logout());
    },

})

var select=function(state) {
    return {
        user_data: state.user_data,
        user_data_loading: state.user_data_loading,
    }
}
module.exports=connect(select)(Layout);
