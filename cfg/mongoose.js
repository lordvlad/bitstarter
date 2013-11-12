/*!
 * cfg/express.js
 *
 * basic application setup
 * 
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */

/**
 * dependencies
 */

var mongoose  = require( 'mongoose' )
    , express = require( 'express'  )
    , maxretries = 4
    , retries = 0


/**
 * functions
 */

function connect( app, db, e ){

    if ( ++retries > maxretries ) return app.events.emit('db.end.error', e )

    app.events.emit( 'db.progress', 'connecting to db; retry #' + retries )
    mongoose.connect( db )
}

/**
 * expose configuring function
 */

exports = module.exports = function( app ) {
    var db = app.get( 'cfg' ).database

    app.events.emit( 'db.begin', 'configuring db' )

    mongoose
	.connection
	.on( 'error', connect.bind( null, app, db ) )
	.once( 'open',  app.events.emit.bind( app.events, 'db.end.ready', 'db connection ready' )) 

    connect.call( null, app, db )
}
