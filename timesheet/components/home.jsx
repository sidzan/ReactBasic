React = require("react");
connect = require("react-redux").connect;
Loading = require('./loading')
TimesheetList = require('./timesheet_list')
TimesheetForm = require('./timesheet_form')
utils = require('../utils')
var Home=React.createClass({
    render() {
    console.log("this.props",this.props.user_data)
    return <div>
        <TimesheetList />
        <TimesheetForm />
    </div>
    }
});

var select=function(state) {
    return {
        user_data: state.user_data,
        user_data_loading: state.user_data_loading,
    }
}

module.exports=connect(select)(Home);
