
exports = module.exports = function( app ){
    var cfg = app.get( 'cfg' )

    if ( cfg.engine[1] === 'mustache' ){
	// autoload mustache partials
	require( '../lib/mustache-autoloader'      )( app )
    }

    require( '../lib/view-helpers'                 )( app )

}
