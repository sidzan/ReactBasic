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
        case "GROCERY_CART_LOADING":
            new_state.grocery_cart_loading=true;
            break;
        case "MEAL_CART_LOADING":
            new_state.meal_cart_loading=true;
            break;
        case "GROCERY_CART_DATA_LOADED":
            new_state.grocery_cart_loading=false;
            new_state.grocery_cart=action.cart;
            break;
        case "MEAL_CART_DATA_LOADED":
            new_state.meal_cart_loading=false;
            new_state.meal_cart=action.cart;
            break;
        case "SENDING_GROCERY_ORDER":
            new_state.sending_grocery_order=true;
            break;
        case "GROCERY_ORDER_CONFIRMED":
            new_state.sending_grocery_order=false;
            delete new_state.grocery_cart;
            break;
        case "SHOW_GROCERY_DETAILS":
            new_state.grocery_details_product_id=action.product_id;
            break;
        case "HIDE_GROCERY_DETAILS":
            new_state.grocery_details_product_id=null;
            break;
        case "SHOW_LOT_DETAILS":
            if (!new_state.show_lot_details) new_state.show_lot_details={};
            new_state.show_lot_details[action.product_id]=true;
            break;
        case "HIDE_LOT_DETAILS":
            if (!new_state.show_lot_details) new_state.show_lot_details={};
            new_state.show_lot_details[action.product_id]=false;
            break;
    }
    console.log("new_state",new_state);
    return new_state;
}
