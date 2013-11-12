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

var express = require( 'express' )
    , cfg   = require( './config'   )
    , pkg   = require( '../package' )

/**
 * expose configuring function
 */

exports = module.exports = function( app ) {

    function configure(){

	var root  = app.get( 'root' )

	app.set( 'cfg', cfg )
	app.set( 'PORT', app.get( 'PORT' ) || 8080 )
	app.set( 'pkg', pkg )

	// set some 
	app.set(	'showStackError'		, cfg['viewStackError'] || true )

	// set the rendering engine and view paths
	app.engine( cfg['view engine']       	, require( cfg['engine'][0] )[cfg['engine'][1]] )
	app.set(    'views'		        	, cfg['views']          || root + '/app/views' )
	app.set(    'view partials'			, cfg['view partials']  || root + '/app/views/partials' )

	// The default engine extension to use when omitted
	app.set(    'view engine'			, cfg['view engine']    || 'html' )

	// switch off layouts, because this is a 
	// speciality of ejs
	app.set(    'view options'			, cfg['view options']   || { layout: false } )

	// compression middleware
	// should be placed before express.static
	app.use( express.compress({
            filter: function (req, res) {
		return ( new RegExp( "/" + cfg.compress.files + "/i" ) ).test( res.getHeader('Content-Type') )
		//return /json|text|javascript|css/.test( res.getHeader('Content-Type') )
            },
            level: 9
	}))

	// favicon and static files
	app.use( express.favicon()                                           )
	app.use( '/js'    , express.static( root + '/pub/js'               ) )
	app.use( '/css'   , express.static( root + '/pub/css'              ) )
	app.use( '/tmpl'  , express.static( root + app.get( 'views' )      ) )
	app.use( '/vendor', express.static( root + app.get( 'cfg' ).vendor ) )

	// don't use logger for test env
	if ( app.get( 'env' ) !== 'test' ) app.use( express.logger('dev') )

	// accept post data. enable multipart
	// only when accepting file uploads
	app.use( express.json() )
	app.use( express.urlencoded() )
	if ( cfg.enableFileUploads ) app.use( express.multipart() )

	// simulate DELETE and PUT via _method
	// POST parameter
	app.use( express.methodOverride() )

	// cookies and sessions
	app.use( express.cookieParser() )
	app.use( express.session({ secret : cfg.session.secret }) )

	// expose package information
	app.use( function( req, res, next ){
	    res.locals.pkg = cfg.pkg
	    next()
	})

    }

    app.events.emit( 'express.begin', 'configuring express' )
    
    try { configure() } catch ( error ){
	return app.events.emit( 'express.end.error', error )
    }

    app.events.emit( 'express.end.ready', 'express configured' )
}
