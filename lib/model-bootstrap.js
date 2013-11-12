/*!
 * lib/controller-bootstrap.js
 *
 * bootstrap controllers and their routes
 * 
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */


/**
 * dependencies
 */

var norm      = require( 'path' ).normalize
, rd      = require( 'fs'   ).readdir
, mongo   = require( 'mongoose' )

/**
 * expose bootstrapper as middleware
 */

exports = module.exports = function ( app ) {
    var dir  = norm( app.get('models') || app.get('root') + '/app/models' )

    app.events.emit( 'models.begin', 'bootstrapping models' )

    rd( dir, function( err, files ){
	if ( err ) return app.events.emit( 'models.error', err )
	files.forEach(function( model ){
	    try {
		if ( ! /\.js$/i.test( model ) ) return
		require( norm( dir + '/' + model ) )
		app.events.emit( 'models.progress', model )
	    } catch ( e ) {
		app.events.emit( 'models.end.error', e )
	    }
	})

	app.events.emit( 'models.end.ready', 'models bootstrapped' )
    })
}
