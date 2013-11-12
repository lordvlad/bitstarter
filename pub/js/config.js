requirejs.config({
    "base_url"              : ''
    ,"paths"                : {
        "jquery"            : "/vendor/jquery/jquery.min"
        ,"bootstrap"        : "/vendor/bootstrap/dist/js/bootstrap.min"
        ,"jasny-bootstrap"  : "/vendor/jasny-bootstrap/dist/js/bootstrap.min"
    }
    ,"shim"                 : {
        "bootstrap"         : {
            "deps"          : ["jquery"]
	    , "exports"     : "$.fn.popover"
        }
        , "jasny-bootstrap" : {
            "deps"          : ["bootstrap"]
            , "exports"     : "$.fn.fileinput"
        }
    }
});

require(["bootstrap"],function(dep){});
require(["jasny-bootstrap"],function(dep){});
require(["profile"], function(dep){});

