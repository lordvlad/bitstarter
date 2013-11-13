
function renderWithConstants ( app, req, res, originalRender ){
    return function ( view, options, callback ){

	options				= options  || {}
	options.user			= req.user || null
	options.pkg			= app.get( 'pkg' ) || null

	options.messages = _.extend( {}, {
	    success	: req.flash( 'success' )
	    , info	: req.flash( 'info' )
	    , warning	: req.flash( 'warning' )
	    , error	: req.flash( 'error' )
	}, req.session.messages, options.messages )

        if ( options.requirejs )
            options.requirejs = qs.stringify( {require: options.requirejs} )

	req.session.messages = {}

	return originalRender( view, options, callback )
    }
}

function includeConstants ( app ) {
    return function ( req, res, next ){
	res.render = renderWithConstants( app, req, res, res.render.bind( res ) )
	next()
    }
}


/**
 * expose function as express middleware
 */

var _    = require( 'lodash' )
    , qs = require( 'qs' )

exports = module.exports = function( app ){

    viewEngine     = app.get( 'view engine' ) || 'html'
    partialsDir    = app.get( 'view partials' ) || app.get( 'views' ) + '/partials' || app.get( 'root' ) + '/views/partials'

    app.use( includeConstants( app ) )
}
