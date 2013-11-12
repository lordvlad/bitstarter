function returnTo( req, res, next ){

    req.returnTo = res.returnTo = function( url ){
        if ( url ) return req.session.returnTo = url
        if ( req.session.returnTo ){
            var x = req.session.returnTo
            req.session.returnTo = null
            return x
        }
    }

    res.return = function(){
        if ( req.session.returnTo ){
            var x = req.session.returnTo
            req.session.returnTo = null
            res.redirect( x || '/' );
        }
    }
    next()
}


module.exports = exports = function( app ){
    app.use( returnTo )
}