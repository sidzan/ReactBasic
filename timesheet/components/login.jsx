/** @jsx React.DOM */
'use strict'

var React = require('react')
var utils = require('../utils')
var connect = require("react-redux").connect

var Login = React.createClass({
    contextTypes: {
        history: React.PropTypes.object
    },
    getInitialState : function(){
        return {};
    },
    componentDidMount: function() {
    },
	render: function() {
            console.log(">>>render.login")
    		return <div className="form-horizontal">
            {function() {
                if (!this.state.error) return;
                return <div className="alert alert-danger">{this.state.error}</div>
            }.bind(this)()}
            <div className="form-group">
                <label className="col-sm-2 control-label">Email</label>
                <div className="col-sm-6">
                    <input type="text" className="form-control" ref="email"/>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-2 control-label">Password</label>
                <div className="col-sm-6">
                    <input type="password" className="form-control" ref="password"/>
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-6 col-sm-offset-2">
                    <button className="btn btn-primary btn-lg" onClick={this.login}><img src="/static/img/spinner.gif" className={this.state.loading ? "":"hidden"}/><span className="glyphicon glyphicon-arrow-right"></span> Continue</button>
                    <a href="/forgot_password"><small className="pull-right">Forgot Password</small></a>
                </div>
            </div>
        </div>
	},

    login: function() {
        var email=this.refs.email.value;
        var password=this.refs.password.value;
        this.setState({loading:true});
        this.props.dispatch(actions.login(email,password,(err)=>{
            console.log("XXX err",err);
            console.log("should change",utils.get_cookie("user_id"),"value");
            if (utils.get_cookie("user_id")){ 
            console.log("should change")
            window.location = "/home";}
            this.setState({loading:false,error:err});
        }));
    },
})
var select=function(state) {
    return {
        user_data: state.user_data,
        user_data_loading: state.user_data_loading,
    }
}

module.exports=connect(select)(Login);
