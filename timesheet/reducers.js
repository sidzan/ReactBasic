module.exports=function(state, action) {
    console.log("##################################");
    console.log("reducer",state,action);
    if (state==null) {
        return {};
    }
    var new_state=$.extend(true,{},state); // XXX: deep-copy
    switch (action.type) {
        case "USER_DATA_LOADING":
            new_state.user_data_loading=true;
            break;
        case "USER_DATA_LOADED":
            new_state.user_data_loading=false;
            new_state.user_data=action.user_data;
            break;
        case "LOGOUT":
            delete new_state.user_data;
            break;
        case "TIME_SHEET_LOADING":
            new_state.time_sheet_loading=true;
            break;
        case "TIME_SHEET_LOADED":
            new_state.time_sheet_loading=false;
            new_state.time_sheet=action.time_sheet;
            break;
    }
    console.log("new_state",new_state);
    return new_state;
}
