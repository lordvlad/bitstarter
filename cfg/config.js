
var applicationRoot = "http://ec2-54-194-6-185.eu-west-1.compute.amazonaws.com:8080/"


module.exports = exports = {

    "session"                  : {
        "secret"               : "blablabla"
    }
    , "compress"               : {
        "files"                : "json|text|javascript|css"
    }
    , "engine"                 : ["consolidate","mustache"]
    , "view engine"            : "html"
    , "view options"           : {
        "layout"               : false
    }
    , "mongodb"                : {
        "host"                 : "mongodb://localhost/your-signs"
    }
    , "redis"                  : {
        "host"                 : "localhost",
        "port"                 : 6379,
        "db"                   : 1,
        "options"              : {
            "return_buffers"   : true
            , "detect_buffers" : true
        }
    }
    , "enableFileUploads"      : true
    , "vendor"                 : "/pub/bower_components"
    , "passport"               : {
        "local"                : {
            "usernameField"    : "email"
            ,  "passwordField" : "password"
        }
        , "facebook"           : {
            "clientID"         : "399425376843801"
            ,"clientSecret"    : "e3854ab2f620b57603759f6d9206a57a"
            ,"callbackURL"     : applicationRoot + "auth/facebook/callback"
            ,"scope"           : ['email', 'user_about_me']
        }
        , "twitter"            : {
            "consumerKey"      : "Cimi7kTNOauxhF3uq4KSKw"
            ,"consumerSecret"  : "jR42v3wo4ZicEfM2OHUH1Ofb58in8WRYsh9BFk"
            ,"callbackURL"     : applicationRoot + "auth/twitter/callback"
        }
        , "google"             : {
            "clientID"         : "41668388182-9lrjj63c44b68g8ejrj8n8oo4mj12ls0.apps.googleusercontent.com"
            ,"clientSecret"    : "Dpn_fW4V_5R0Nyr4wKLmrZU5"
            ,"callbackURL"     : applicationRoot + "auth/google/callback"
            ,"scope"           : [
                'https         ://www.googleapis.com/auth/userinfo.profile'
                , 'https       ://www.googleapis.com/auth/userinfo.email'
            ]
        }
    }
}
