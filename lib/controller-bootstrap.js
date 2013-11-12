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

var norm  = require( 'path' ).normalize
, rd = require( 'fs'   ).readdir

/**
 * bootstrap controllers
 */

exports = module.exports = function ( app ) {
    var dir = app.get( 'controllers' ) || norm( app.get( 'root' ) + '/app/controllers' )
    
    app.controllers = app.controllers || {}

    app.events.emit( 'controllers.begin', 'bootstrapping controllers' )

    
    rd( dir, function( err, files ){

	if ( err ) return app.events.emit( 'controllers.end.error', err )
	
	files.forEach( function ( cName ) {
	    try {
		var controller = app.controllers[ cName] = require( norm( dir + '/' + cName ) )
		app.events.emit( 'controllers.progress', cName )

		if ( controller._routes ){
		    controller._routes( app )
		} else {
		    for ( var action in controller ){
			if ( ! controller.hasOwnProperty( action ) ) continue
			app.get( '/' + cName + '/' + action, action )
		    }
		}
	    } catch ( e ) {
		return app.events.emit( 'controllers.end.error', e )
	    }
	})
	app.events.emit( 'controllers.end.ready', 'controllers bootstrapped' )
    })


    
}
