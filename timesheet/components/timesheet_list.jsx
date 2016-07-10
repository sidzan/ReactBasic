var React = require("react");
var connect = require("react-redux").connect;
var Loading = require('./loading')
var utils = require('../utils')
var Table = require ('react-bootstrap').Table
var TimesheetList=React.createClass({
    render() {
    console.log(this.props,"timesheet")
    var p  = this.props;
    if (p.time_sheet_loading) return <Loading/>
    var ds = {'waiting_approval':'Waiting Approval'}
    return <div>
        <Table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Project Name</th>
                <th>State</th>
                <th>Actual Hours</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        {p.time_sheet.map(function(d){
        return  <tr key={d.id}>
            <td>{d.date}</td>
            <td>{d.description}</td>
            <td>{d.project_id.name}</td>
            <td>{ds[d.state]}</td>
            <td>{d.actual_hours}</td>
            <td style={{cursor:'pointer'}}onClick={this.delete_record.bind(this,d.id)}>X</td>
            </tr>
        }.bind(this))}
        </tbody>
        </Table>
    </div>
    },
    delete_record:function(id){
        this.props.dispatch(actions.remove_work_time(id));  
    }
});

var select=function(state) {
    return {
        time_sheet_loading :state.time_sheet_loading,
        time_sheet : state.time_sheet,
    }
}

module.exports=connect(select)(TimesheetList);
