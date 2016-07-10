RPC=require("./RPC");
actions=require("./actions")
utils=require("./utils");

module.exports.sign_up=function(vals,cb) {
    console.log(">>> actions.sign_up",vals);
    return function(dispatch,getState) {
        var ctx={
            meal_cart_id: parseInt(utils.get_cookie("meal_cart_id")),
            grocery_cart_id: parseInt(utils.get_cookie("grocery_cart_id")),
        };
        RPC.execute("ecom2.interface","sign_up",[vals],{context:ctx},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            utils.set_cookie("user_id",""+data.user_id);
            utils.set_cookie("token",data.token);
            cb();
            dispatch(actions.load_user_data());
            dispatch(actions.load_meal_cart_data());
            dispatch(actions.load_grocery_cart_data());
        }.bind(this));
    }
}

module.exports.login=function(email,password,cb) {
    console.log(">>> actions.login",email,password);
    var ctx={
        meal_cart_id: parseInt(utils.get_cookie("meal_cart_id")),
        grocery_cart_id: parseInt(utils.get_cookie("grocery_cart_id")),
    };
    return function(dispatch,getState) {
        RPC.execute("ecom2.interface","login",[email,password],{context: ctx},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            cb();
            utils.set_cookie("user_id",""+data.user_id);
            utils.set_cookie("token",data.token);
            dispatch(actions.load_user_data());
            dispatch(actions.load_meal_cart_data());
            dispatch(actions.load_grocery_cart_data());
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
        RPC.execute("base.user","read_path",[[user_id],["contact_id.email","contact_id.first_name","contact_id.last_name","contact_id.addresses.address","contact_id.addresses.postal_code","contact_id.previous_sale_products.name","contact_id.previous_sale_products.sale_price","contact_id.previous_sale_products.sale_uom_id","contact_id.previous_sale_products.sale_invoice_uom_id.name","contact_id.previous_sale_products.image","contact_id.previous_sale_products.stock_qty","contact_id.previous_sale_products.product_origin","contact_id.addresses.province_id.name","contact_id.addresses.mobile","contact_id.addresses.phone","contact_id.addresses.instructions_messenger","contact_id.addresses.subdistrict_id.name","contact_id.request_product_groups.name","contact_id.exclude_product_groups.name","contact_id.plr_notif_remind_sms","contact_id.plr_notif_remind_email","contact_id.plr_notif_deliv_sms","contact_id.plr_notif_deliv_email","contact_id.addresses.require_cutlery","contact_id.addresses.packaging_id","contact_id.addresses.delivery_slot_id","contact_id.addresses.packaging_id","contact_id.addresses.delivery_slot_id.name","contact_id.addresses.packaging_id.name","contact_id.previous_sale_products.sale_price_order_uom","contact_id.previous_sale_products.ecom_hide_unavail","contact_id.previous_sale_products.ecom_hide_qty","contact_id.previous_sale_products.ecom_no_order_unavail"]],{},function(err,data) {
            utils.set_cookie("user_id",""+user_id);
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
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
    window.location = "/meals";
    return {
        type: "LOGOUT",
    }
}

function create_grocery_cart(cb,getState) {
    console.log("create_grocery_cart");
    var user_data=getState().user_data;
    var contact_id=user_data?user_data.contact_id.id:null;
    var ctx={cart_type:"grocery",contact_id:contact_id};
    RPC.execute("ecom2.cart","create",[{"plr_cart_type":"grocery","customer_id":contact_id}],{context:ctx},function(err,cart_id) {
        if (err) {
            alert("Failed to create grocery cart: "+err.message);
            return;
        }
        try {
            utils.set_cookie("grocery_cart_id",""+cart_id);
        } catch (e) {
            alert("Failed to write to local storage");
        }
        cb(cart_id);
    });
}

function create_meal_cart(cb,getState) {
    console.log("create_meal_cart");
    var user_data=getState().user_data;
    var contact_id=user_data?user_data.contact_id.id:null;
    var ctx={cart_type:"meal",contact_id:contact_id};
    RPC.execute("ecom2.cart","create",[{"plr_cart_type":"meal","customer_id":contact_id}],{context:ctx},function(err,cart_id) {
        if (err) {
            alert("Failed to create meal cart: "+err.message);
            return;
        }
        try {
            utils.set_cookie("meal_cart_id",""+cart_id);
        } catch (e) {
            alert("Failed to write to local storage");
        }
        cb(cart_id);
    });
}

module.exports.grocery_cart_set_qty=function(prod_id,qty) {
    console.log(">>> actions.grocery_cart_set_qty",prod_id,qty);
    return function(dispatch,getState) {
        var f=function(cart_id) {
            RPC.execute("ecom2.cart","set_qty",[[cart_id],prod_id,qty],{},function(err,data) {
                if (err) {
                    alert("Error: "+err.message);
                    return;
                }
                dispatch(actions.load_grocery_cart_data());
            });
        }
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        if (cart_id) {
            f(cart_id);
        } else {
            create_grocery_cart(f,getState);
        }
    }
}

module.exports.grocery_cart_set_qty_auto_select_lot=function(prod_id,qty) {
    console.log(">>> actions.grocery_cart_set_qty_auto_select_lot",prod_id,qty);
    return function(dispatch,getState) {
        var f=function(cart_id) {
            RPC.execute("ecom2.cart","set_qty_auto_select_lot",[[cart_id],prod_id,qty],{},function(err,data) {
                if (err) {
                    alert("Error: "+err.message);
                    return;
                }
                dispatch(actions.load_grocery_cart_data());
            });
        }
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        if (cart_id) {
            f(cart_id);
        } else {
            create_grocery_cart(f,getState);
        }
    }
}

module.exports.grocery_cart_delete_line=function(line_id) {
    console.log(">>> actions.grocery_cart_delete_line",line_id);
    return function(dispatch,getState) {
        RPC.execute("ecom2.cart.line","delete",[[line_id]],{},function(err) {
            if (err) {
                alert("Error: "+err.message);
                return;
            }
            dispatch(actions.load_grocery_cart_data());
        });
    }
}

module.exports.meal_cart_set_qty=function(due_date,prod_id,qty) {
    console.log(">>> actions.meal_cart_set_qty",due_date,prod_id,qty);
    return function(dispatch,getState) {
        var f=function(cart_id) {
            RPC.execute("ecom2.cart","set_date_qty",[[cart_id],due_date,prod_id,qty],{},function(err,data) {
                if (err) {
                    alert("Failed to set qty in meal cart: "+err.message);
                    return;
                }
                dispatch(actions.load_meal_cart_data());
            });
        }
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        if (cart_id) {
            f(cart_id);
        } else {
            create_meal_cart(f,getState);
        }
    }
}

module.exports.meal_cart_add_preselect=function(vals) {
    console.log(">>> actions.meal_cart_add_preselect",vals);
    return function(dispatch,getState) {
        var f=function(cart_id) {
            RPC.execute("ecom2.cart","add_preselection",[[cart_id],vals],{},function(err,data) {
                if (err) {
                    alert("Failed to set qty in meal cart: "+err.message);
                    return;
                }
                dispatch(actions.load_meal_cart_data());
            });
        }
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        if (cart_id) {
            f(cart_id);
        } else {
            create_meal_cart(f,getState);
        }
    }
}

module.exports.grocery_cart_add_lot=function(prod_id,lot_id) {
    console.log(">>> actions.grocery_cart_add_lot",prod_id,lot_id);
    return function(dispatch,getState) {
        var f=function(cart_id) {
            RPC.execute("ecom2.cart","add_lot",[[cart_id],prod_id,lot_id],{},function(err,data) {
                if (err) {
                    alert("Failed to add lot to grocery cart: "+err.message);
                    return;
                }
                dispatch(actions.load_grocery_cart_data());
            });
        }
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        if (cart_id) {
            f(cart_id);
        } else {
            create_grocery_cart(f,getState);
        }
    }
}

module.exports.grocery_cart_remove_lot=function(prod_id,lot_id) {
    console.log(">>> actions.grocery_cart_remove_lot",prod_id,lot_id);
    return function(dispatch,getState) {
        var f=function(cart_id) {
            RPC.execute("ecom2.cart","remove_lot",[[cart_id],prod_id,lot_id],{},function(err,data) {
                if (err) {
                    alert("Failed to remove lot from grocery cart: "+err.message);
                    return;
                }
                dispatch(actions.load_grocery_cart_data());
            });
        }
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        if (cart_id) {
            f(cart_id);
        } else {
            create_grocery_cart(f,getState);
        }
    }
}

module.exports.grocery_cart_update=function(vals,cb) {
    console.log(">>> actions.grocery_cart_update",vals);
    return function(dispatch,getState) {
        var f=function(cart_id) {
            RPC.execute("ecom2.cart","write",[[cart_id],vals],{},function(err,data) {
                if (err) {
                    cb(err.message);
                    return;
                }
                if (cb) cb();
                dispatch(actions.load_grocery_cart_data());

            });
        }
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        if (cart_id) {
            f(cart_id);
        } else {
            create_grocery_cart(f,getState);
        }
    }
}

module.exports.load_grocery_cart_data=function() {
    console.log(">>> actions.load_grocery_cart_data");
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        if (!cart_id) return;
        dispatch({
            type: "GROCERY_CART_LOADING",
        });
        RPC.execute("ecom2.cart","read_path",[[cart_id],["delivery_date","delivery_slot_id","amount_total","lines.product_id.name","lines.product_id.image","lines.qty","lines.uom_id.name","lines.unit_price","lines.lot_id.weight","delivery_slots","payment_methods", "lines.product_id.ecom_no_order_unavail","lines.product_id.ecom_hide_unavail","lines.product_id.plr_ecom_lots","lines.product_id.ecom_select_lot","lines.qty_avail","lines.delivery_delay","voucher_id","ship_addresses","lines.product_id.sale_lead_time_nostock","free_ship_address"]],{},function(err,res) {
            if (err) {
                alert("Failed to read cart");
                return;
            }
            dispatch({
                type: "GROCERY_CART_DATA_LOADED",
                cart: res[0],
            });
        });
    }
}

module.exports.load_meal_cart_data=function() {
    console.log(">>> actions.load_meal_cart_data");
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        if (!cart_id) return;
        dispatch({
            type: "MEAL_CART_LOADING",
        });
        RPC.execute("ecom2.cart","read_path",[[cart_id],["amount_ship","amount_total","lines.product_id.name","lines.product_id.image","lines.qty","lines.uom_id.name","lines.unit_price","lines.amount","lines.lot_id.weight","lines.delivery_date","lines.ship_address_id","lines.delivery_slot_id","lines.packaging_id","payment_methods","ship_addresses","voucher_id.code","voucher_id.description","amount_voucher","voucher_error_message","date_delivery_slots","customer_id.plr_reusable_remain","lines.cutlery","lines.packaging_id.name","lines.amount","plr_reusable_amount"]],{},function(err,res) {
            if (err) {
                alert("Failed to read cart");
                return;
            }
            console.log("data data",res[0])
            dispatch({
                type: "MEAL_CART_DATA_LOADED",
                cart: res[0],
            });
        });
    }
}

module.exports.meal_cart_update_delivery=function(due_date,vals,cb) {
    console.log(">>> actions.meal_cart_update_delivery",due_date,vals);
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        RPC.execute("ecom2.cart","update_date_delivery",[[cart_id],due_date,vals],{},function(err,data) {
            if (err) {
                alert("Failed to update delivery in meal cart: "+err.message);
                return;
            }
            cb(data);
            dispatch(actions.load_meal_cart_data());
        });
    }
}
module.exports.updateComment  =function(vals) {
    console.log(">>> actions.updateComment",vals);
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        RPC.execute("ecom2.cart","write",[[cart_id],vals],{},function(err,data) {
            if (err) {
                alert("Failed to update delivery in meal cart: "+err.message);
                return;
            }
            dispatch(actions.load_meal_cart_data());
        });
    }
}
module.exports.meal_cart_update_line=function(line_id,vals) {
    console.log(">>> actions.meal_cart_update_line",line_id,vals);
    return function(dispatch,getState) {
        RPC.execute("ecom2.cart.line","write",[[line_id],vals],{},function(err,data) {
            if (err) {
                alert("Failed to update meal cart line: "+err.message);
                return;
            }
            dispatch(actions.load_meal_cart_data());
        });
    }
}


module.exports.add_address=function(vals) {
    console.log(">>> actions.add_address",vals);
    return function(dispatch,getState) {
        vals.contact_id=getState().user_data.contact_id.id;
        RPC.execute("address","create",[vals],{},function(err,data) {
            if (err) {
                alert("Failed to create address: "+err.message);
                return;
            }
            dispatch(actions.load_user_data());
        }.bind(this));
    }
}
module.exports.edit_address=function(vals,address_id) {
    console.log(">>> actions.add_address",vals);
    return function(dispatch,getState) {
        vals.contact_id=getState().user_data.contact_id.id;
        RPC.execute("address","write",[[address_id],vals],{},function(err,data) {
            if (err) {
                alert("Failed to create address: "+err.message);
                return;
            }
            dispatch(actions.load_user_data());
        }.bind(this));
    }
}

module.exports.delete_address=function(address_id) {
    console.log(">>> actions.delete_address",address_id);
    return function(dispatch,getState) {
        RPC.execute("address","delete",[[address_id]],{},function(err,data) {
            if (err) {
                alert("Failed to delete address: "+err.message);
                return;
            }
            dispatch(actions.load_user_data());
        }.bind(this));
    }
}

module.exports.confirm_grocery_order=function(cb) {
    console.log(">>> actions.confirm_grocery_order");
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        if (!cart_id) {
            alert("Grocery cart not found");
            return;
        }
        dispatch({
            type: "SENDING_GROCERY_ORDER",
        });
        var ctx={
            user_id: parseInt(utils.get_cookie("user_id")),
        };
        RPC.execute("ecom2.cart","confirm",[[cart_id]],{context:ctx},function(err,data) {
            if (err) {
                cb(err.message)
                return;
            }
            cb();
            dispatch(actions.grocery_order_confirmed(data.sale_id));
        }.bind(this));
    }
}

module.exports.confirm_meal_order=function(cb) {
    console.log(">>> actions.confirm_meal_order");
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        if (!cart_id) {
            alert("Meal cart not found");
            return;
        }
        dispatch({
            type: "SENDING_MEAL_ORDER",
        });
        var ctx={
            user_id: parseInt(utils.get_cookie("user_id")),
        };
        RPC.execute("ecom2.cart","confirm",[[cart_id]],{context:ctx},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            cb()
            dispatch(actions.meal_order_confirmed(data.sale_id));
        }.bind(this));
    }
}

module.exports.confirm_credit_order=function(prod_code,pay_method_id) {
    console.log(">>> actions.confirm_credit_order",prod_code,pay_method_id);
    return function(dispatch,getState) {
        var ctx={
            user_id: parseInt(utils.get_cookie("user_id")),
        };
        RPC.execute("plr.ecom.interface","create_credit_order",[prod_code,pay_method_id],{context:ctx},function(err,data) {
            if (err) {
                alert("Failed to send order: "+err.message);
                return;
            }
            window.location="/order_details/"+data.sale_id;
        }.bind(this));
    }
}

module.exports.grocery_order_confirmed=function(order_id) {
    console.log(">>> actions.grocery_order_confirmed",order_id);
    utils.clear_cookie("grocery_cart_id")
    window.location="/order_details/"+order_id;
    return {
        type: "GROCERY_ORDER_CONFIRMED",
    }
}

module.exports.meal_order_confirmed=function(order_id) {
    console.log(">>> actions.meal_order_confirmed",order_id);
    utils.clear_cookie("meal_cart_id")
    window.location="/order_details/"+order_id;
    return {
        type: "MEAL_ORDER_CONFIRMED",
    }
}

module.exports.show_grocery_details=function(prod_id) {
    console.log(">>> actions.show_grocery_details",prod_id);
    return {
        type: "SHOW_GROCERY_DETAILS",
        product_id: prod_id,
    }
}

module.exports.hide_grocery_details=function() {
    console.log(">>> actions.hide_grocery_details");
    return {
        type: "HIDE_GROCERY_DETAILS",
    }
}

module.exports.show_lot_details=function(prod_id) {
    console.log(">>> actions.show_lot_details",prod_id);
    return {
        type: "SHOW_LOT_DETAILS",
        product_id: prod_id,
    }
}

module.exports.hide_lot_details=function(prod_id) {
    console.log(">>> actions.hide_lot_details",prod_id);
    return {
        type: "HIDE_LOT_DETAILS",
        product_id: prod_id,
    }
}

module.exports.bank_transfer_completed=function(order_id,price_plan,transfer_date,transfer_amount,transfer_receipt,cb) {
    console.log(">>> actions.bank_transfer_completed",order_id,transfer_date,transfer_amount,transfer_receipt);
    return function(dispatch,getState) {
        var ctx={};
        if (price_plan) ctx.price_plan=price_plan;
        if (transfer_date) ctx.transfer_date=transfer_date;
        if (transfer_amount) ctx.transfer_amount=transfer_amount;
        if (transfer_receipt) ctx.transfer_receipt=transfer_receipt;
        RPC.execute("sale.order","bank_transfer_completed",[[order_id]],{context:ctx},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            cb();
            window.location.reload();
        }.bind(this));
    }
}

module.exports.enable_preap=function(cb) {
    console.log(">>> actions.enable_preap");
    return function(dispatch,getState) {
        var contact_id=getState().user_data.contact_id.id;
        RPC.execute("contact","paypal_enable_preap",[[contact_id]],{},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            var next=data.next;
            console.log("next",next);
            if (next) {
                if (next.type=="url") {
                    window.location=next.url;
                }
            }
        }.bind(this));
    }
}

module.exports.disable_preap=function(cb) {
    console.log(">>> actions.disable_preap");
    return function(dispatch,getState) {
        var contact_id=getState().user_data.contact_id.id;
        RPC.execute("contact","paypal_disable_preap",[[contact_id]],{},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            window.location.reload(); // XXX
        }.bind(this));
    }
}

module.exports.add_prefs=function(contact_id,group_id,cb){
    console.log(">>> actions.add_prefs",contact_id,group_id);
    return function(dispatch,getState) {
        RPC.execute("ecom2.interface","add_request_product_groups",[contact_id,group_id],{},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            cb()
            dispatch(actions.load_user_data());
        }.bind(this));
    }
}

module.exports.delete_prefs=function(contact_id,group_id){
    console.log(">>> actions.delete_prefs",contact_id,group_id);
    return function(dispatch,getState) {
        RPC.execute("ecom2.interface","remove_request_product_groups",[contact_id,group_id],{},function(err,data) {
            if (err) {
                alert("Failed to remove data: "+err.message);
                return;
            }
            dispatch(actions.load_user_data());
        }.bind(this));
    }
}

module.exports.add_allergies=function(contact_id,group_id,cb){
    console.log(">>> actions.add_allergies",contact_id,group_id);
    return function(dispatch,getState) {
        RPC.execute("ecom2.interface","add_exclude_product_groups",[contact_id,group_id],{},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            cb()
            dispatch(actions.load_user_data());
        }.bind(this));
    }
}

module.exports.delete_allergies=function(contact_id,group_id){
    console.log(">>> actions.delete_allerriges",contact_id,group_id);
    return function(dispatch,getState) {
        RPC.execute("ecom2.interface","remove_exclude_product_groups",[contact_id,group_id],{},function(err,data) {
            if (err) {
                alert("Failed to remove data: "+err.message);
                return;
            }
            dispatch(actions.load_user_data());
        }.bind(this));
    }
}

module.exports.meal_cart_apply_voucher_code=function(voucher_code,cb) {
    console.log(">>> actions.meal_cart_apply_voucher_code",voucher_code);
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        RPC.execute("ecom2.cart","apply_voucher_code",[[cart_id],voucher_code],{},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            dispatch(actions.load_meal_cart_data());
            if (cb) cb();
        });
    }
}

module.exports.meal_cart_clear_voucher=function(cb) {
    console.log(">>> actions.meal_cart_clear_voucher");
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("meal_cart_id"));
        RPC.execute("ecom2.cart","clear_voucher",[[cart_id]],{},function(err,data) {
            if (err) {
                alert("Error: "+err.message);
                return;
            }
            dispatch(actions.load_meal_cart_data());
            if (cb) cb();
        });
    }
}

module.exports.grocery_cart_apply_voucher_code=function(voucher_code,cb) {
    console.log(">>> actions.grocery_cart_apply_voucher_code",voucher_code);
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        RPC.execute("ecom2.cart","apply_voucher_code",[[cart_id],voucher_code],{},function(err,data) {
            if (err) {
                alert("Error: "+err.message);
                return;
            }
            dispatch(actions.load_grocery_cart_data());
            if (cb) cb();
        });
    }
}

module.exports.grocery_cart_clear_voucher=function(cb) {
    console.log(">>> actions.grocery_cart_clear_voucher");
    return function(dispatch,getState) {
        var cart_id=parseInt(utils.get_cookie("grocery_cart_id"));
        RPC.execute("ecom2.cart","clear_voucher",[[cart_id]],{},function(err,data) {
            if (err) {
                alert("Error: "+err.message);
                return;
            }
            dispatch(actions.load_grocery_cart_data());
            if (cb) cb();
        });
    }
}

module.exports.save_price_plan=function(order_id,pay_for,pay_amount,transfer_rec_amount) {
    return function(dispatch,getState) {
        var ctx={};
        RPC.execute("sale.order","save_price_plan",[[order_id],pay_for,pay_amount,transfer_rec_amount],{},function(err,data) {
            if (err) {
                alert("Failed to call remote method: "+err.message);
                return;
            }
        }.bind(this));
    }
}

module.exports.save_pay_method=function(order_id,pay_method_id) {
    return function(dispatch,getState) {
        var ctx={};
        RPC.execute("sale.order","save_pay_method",[[order_id],pay_method_id],{},function(err,data) {
            if (err) {
                alert("Error: "+err.message);
                return;
            }
        }.bind(this));
    }
}

module.exports.notification_update=function(vals,contact_id) {
    console.log(">>> actions.notification_update",vals,contact_id);
    return function(dispatch,getState) {
        RPC.execute("contact","write",[[contact_id],vals],{},function(err,data) {
            if (err) {
                alert("Failed to update contact : "+err.message);
                return;
            }
            dispatch(actions.load_user_data());
        });
    }
}
module.exports.cancel_order=function(order_id) {
    return function(dispatch,getState) {
        var ctx={};
        RPC.execute("sale.order","plr_cancel_order",[[order_id]],{},function(err,data) {
            if (err) {
                alert("Failed to call remote method: "+err.message);
                return;
            }
            window.location.reload();
        }.bind(this));
    }
}
module.exports.empty_cart=function(cart_id) {
    return function(dispatch,getState) {
        var ctx={};
        RPC.execute("ecom2.cart","empty_cart",[[cart_id]],{},function(err,data) {
            if (err) {
                alert("Failed to call remote method: "+err.message);
                return;
            }
            dispatch(actions.load_meal_cart_data());
            dispatch(actions.load_grocery_cart_data());
        }.bind(this));
    }
}
module.exports.empty_cart=function(cart_id,grocery) {
    return function(dispatch,getState) {
        var ctx={};
        RPC.execute("ecom2.cart","empty_cart",[[cart_id]],{},function(err,data) {
            if (err) {
                alert("Failed to call remote method: "+err.message);
                return;
            }
            dispatch(actions.load_meal_cart_data());
            dispatch(actions.load_grocery_cart_data());
        }.bind(this));
    }
}
module.exports.pay_with_paypal=function(order_id,cb) {
    console.log(">>> actions.pay_with_paypal",order_id);
    return function(dispatch,getState) {
        var ctx={
            pay_method_id: 2, // XXX
        };
        RPC.execute("sale.order","pay_online",[[order_id]],{context:ctx},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            cb()
            var url=data.next.url;
            window.location=url;
        }.bind(this));
    }
}

module.exports.pay_with_paysbuy=function(order_id) {
    console.log(">>> actions.pay_with_paysbuy",order_id);
    return function(dispatch,getState) {
        var ctx={
            pay_method_id: 7, // XXX
        };
        RPC.execute("sale.order","pay_online",[[order_id]],{context:ctx},function(err,data) {
            if (err) {
                alert("Error: "+err.message);
                return;
            }
            var url=data.next.url;
            window.location=url;
        }.bind(this));
    }
}

module.exports.transfer_bitcoin=function(order_id,cb) {
    console.log(">>> actions.transfer_bitoin",order_id);
    return function(dispatch,getState) {
        var ctx={
            pay_method_id: 4, // XXX
        };
        RPC.execute("sale.order","pay_online",[[order_id]],{context:ctx},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            var transaction_no=data.transaction_no;
            if (cb) cb(null,transaction_no);
        }.bind(this));
    }
}

module.exports.pay_counter_service=function(order_id,cb) {
    console.log(">>> actions.pay_counter_service",order_id);
    return function(dispatch,getState) {
        var ctx={};
        RPC.execute("sale.order","pay_counter_service",[[order_id]],{context:ctx},function(err,data) {
            if (err) {
                cb(err.message);
                return;
            }
            if (cb) cb(null);
        }.bind(this));
    }
}
