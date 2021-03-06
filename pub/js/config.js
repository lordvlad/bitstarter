requirejs.config({
    "base_url"              : ''
    ,"paths"                : {
        "jquery"            : "/vendor/jquery/jquery.min"
        ,"bootstrap"        : "/vendor/bootstrap/dist/js/bootstrap"
        ,"fileinput"        : "/vendor/jasny-bootstrap/js/fileinput"
    }
    ,"shim"                 : {
        "bootstrap"         : {
            "deps"          : ["jquery"]
	    , "exports"     : "$.fn.popover"
        }
        , "fileinput" : {
            "deps"          : ["jquery", "bootstrap"]
            , "exports"     : "$.fn.fileinput"
        }
    }
    ,"require always"       : ["bootstrap"]
});
require(["bootstrap"], function(dep){});
require(["profile"], function(dep){});

