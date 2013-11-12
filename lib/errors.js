/*!
 * cfg/errors.js
 *
 * basic application setup
 * 
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */


function error500 ( err, req, res, next ){
    // if the error message contains
    // 'not found' assume the error to 
    // be a 404 and let the next middle-
    // ware do the job
    if ( err.message.match( /user not found/i ) ) return next ()

    // log the error to the console
    console.error( err.stack || err.message )

    res.status( 500 ).render( '500', { message : err.message, stack : err.stack } )
}

function error404 ( req, res, next ){
    res.status( 404 ).render( '404', { url: req.originalUrl, prev : req.get('referrer') } )    
}

/**
 * expose configuring function
 */

exports = module.exports = function( app ) {
    app.use( error500 )
    app.use( error404 )
}
