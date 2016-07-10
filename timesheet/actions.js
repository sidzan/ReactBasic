RPC=require("./RPC");
actions=require("./actions")
utils=require("./utils");

module.exports.login=function(email,password,cb) {
    console.log(">>> actions.login",email,password);
    return function(dispatch,getState) {
        RPC.execute("ecom2.interface","login",[email,password],{},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            utils.set_cookie("user_id",""+data.user_id);
            utils.set_cookie("token",data.token);
            cb();
            dispatch(actions.load_time_sheet());
        }.bind(this));
    }
}

module.exports.load_user_data=function() {
    console.log(">>> actions.load_user_data");
    return function(dispatch) {
        var user_id=parseInt(utils.get_cookie("user_id"));
        if (!user_id) throw "User ID not found";
        dispatch({
            type: "USER_DATA_LOADING",
        });
        RPC.execute("base.user","read_path",[[user_id],["contact_id.email","contact_id.first_name","contact_id.last_name"]],{},function(err,data) {
            utils.set_cookie("user_id",""+user_id);
            console.log("User data loaded",data[0]);
            dispatch({
                type: "USER_DATA_LOADED",
                user_data: data[0],
            });
        }.bind(this));
    }
}

module.exports.logout=function() {
    console.log(">>> actions.logout");
    utils.clear_cookie("user_id")
    window.location = "/login";
    return {
        type: "LOGOUT",
    }
}


module.exports.load_time_sheet=function() {
    console.log(">>> actions.load_time_sheet");
    return function(dispatch,getState) {
        var user_id=parseInt(utils.get_cookie("user_id"));
        if (!user_id) return;
        dispatch({
            type: "TIME_SHEET_LOADING",
        });
        RPC.execute("work.time","search_read_path",[[],["description","resource_id.name","actual_hours","date","state","project_id.name"]],{},function(err,res) {
            if (err) {
                alert("Failed to read data");
                return;
            }
            console.log("res",res)
            dispatch({
                type: "TIME_SHEET_LOADED",
                time_sheet: res,
            });
        });
    }
}

module.exports.add_work_time=function(vals) {
    console.log(">>> actions.add_work_time",vals);
    return function(dispatch,getState) {
        RPC.execute("work.time","create",[vals],{},function(err,res) {
            if (err) {
                alert("Failed");
                return;
            }
        });
        dispatch(actions.load_time_sheet());
    }
}
module.exports.remove_work_time=function(id) {
    console.log(">>> actions.remove_work_time",id);
    return function(dispatch,getState) {
        RPC.execute("work.time","delete",[[id]],{},function(err,res) {
            if (err) {
                alert("Failed");
                return;
            }
        });
        dispatch(actions.load_time_sheet());
    }
}
