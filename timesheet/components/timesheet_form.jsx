var React = require("react");
var RPC = require("../RPC");
var connect = require("react-redux").connect
var DateField = require ('react-date-picker').DateField
var TimesheetForm=React.createClass({
    getInitialState:function(){
        return {};
    },
    componentDidMount:function(){
        RPC.execute("project","search_read_path",[[],["name"]],{},function(err,res) {
            if (err) {
                alert("Failed to read data");
                return;
            }
            console.log("project",res)
            this.setState({project:res})
        }.bind(this));
        RPC.execute("service.resource","search_read_path",[[],["name"]],{},function(err,res) {
            if (err) {
                alert("Failed to read data");
                return;
            }
            console.log("resource",res)
            this.setState({resource:res})
        }.bind(this));
    },

    render:function() {
    console.log(this.props,"timesheet",this.state)
    var p  = this.props;
    var d = this.state;
    if (!d.project) {return <Loading/>}
    var ds = {'waiting_approval':'Waiting Approval'}
    var project = _.map(this.state.project,function(dataItem){
        return <option key={dataItem.id} value={dataItem.id}>{dataItem.name}</option>
    })
    var resource = _.map(this.state.resource,function(dataItem){
        return <option key={dataItem.id} value={dataItem.id}>{dataItem.name}</option>
    })
    return <div>
            <form ref="work_time_form" onSubmit={this.submit} className="jumbotron col-sm-4">
                <h4>Add New Time Slot</h4>
                <div className="form-group">
                    <input className="form-control" type="text" onChange={this.description} placeholder="Description"/>
                </div>
                <div className="form-group">
                    <input  className="form-control" type="text" onChange={this.actual_hours} placeholder="Actual Hours"/>
                </div>
                <div className="form-group">
                    <select onChange={this.set_resource} className="form-control" >
                        <option default selected>Choose resource</option>
                        {resource}
                    </select>
                </div>
                <div className="form-group">
                    <select onChange={this.set_project} className="form-control" >
                        <option default selected>Choose Project</option>
                        {project}
                    </select>
                </div>
                <div className="form-group">
                    <DateField
                          dateFormat="YYYY-MM-DD"
                          onChange={this.onDateChange}
                          />
                </div>
                <button onSubmit={this.submit} type="submit" className="btn btn-default">Submit</button>
            </form>
    </div>
    },
    description:function(e){
        console.log(e)
        this.setState({description:e.target.value});
    },
    actual_hours:function(e){
        this.setState({actual_hour:e.target.value});
    },
    set_project:function(e){
        this.setState({project_id:e.target.value});
    },
    set_resource:function(e){
        this.setState({resource_id:e.target.value});
    },
    onDateChange:function(e) {
        this.setState({date:e})
    },
    submit:function(e){
        e.preventDefault()
        var s = this.state;
        if (!s.date || ! s.description || !s.actual_hour || !s.project_id || !s.resource_id){
            alert("you missed important data")
            }
        vals ={
            description:s.description,
            actual_hours:s.actual_hour,
            project_id:Number(s.project_id),
            resource_id:Number(s.resource_id),
            date:s.date,
        }
        console.log("vals are " ,vals)
        this.props.dispatch(actions.add_work_time(vals));
        this.refs.work_time_form.reset();
    },
});


module.exports=connect()(TimesheetForm);
