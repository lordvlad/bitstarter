/*!
 * cfg/express.js
 *
 * add CSRF support
 * 
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */

/**
 * dependencies
 */

var express = require( 'express' )

/**
 * functions
 */

function csrf( req, res, next ){
    res.locals.crsf_token = req.csrfToken()
    next()
}

/**
 * expose configuring function
 */

exports = module.exports = function( app ) {
    return;

    // dont runt this in test environment    
    if ( this.get('env') === 'test' ) return;

    app.use(express.csrf())
    app.use( csrf )

}
