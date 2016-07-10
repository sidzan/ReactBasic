var numeral = require('numeral');

module.exports.get_thumbnail=function(fname,size) {
    if (!fname) return null;
    var res=fname.split(".");
    var basename=res[0]; // FIXME
    var ext=res[1];
    return basename+"-resize-"+size+"."+ext;
}

module.exports.format_money=function(v,fmt) {
    if (!fmt) fmt="0,0";
    return numeral(v).format(fmt);
}

module.exports.get_cookie = function(sName) {
    sName = sName.toLowerCase();
    var oCrumbles = document.cookie.split(';');
    for(var i=0; i<oCrumbles.length;i++)
    {
        var oPair= oCrumbles[i].split('=');
        var sKey = decodeURIComponent(oPair[0].trim().toLowerCase());
        var sValue = oPair.length>1?oPair[1]:'';
        if(sKey == sName)
            return decodeURIComponent(sValue);
    }
    return '';
}


function set_cookie(sName,sValue) {
    var oDate = new Date();
    oDate.setYear(oDate.getFullYear()+1);
    var sCookie = encodeURIComponent(sName) + '=' + encodeURIComponent(sValue) + ';expires=' + oDate.toGMTString() + ';path=/';
    document.cookie= sCookie;
}

module.exports.set_cookie = set_cookie;

module.exports.clear_cookie = function(sName) {
    set_cookie(sName,'');
}
