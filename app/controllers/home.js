/**
 * module dependencies
 */

var norm	= require( 'path' ).normalize
    , fs	= require( 'fs' )
    , mongoose	= require( 'mongoose' )
    , User	= mongoose.model( 'User' )
    , Ticket	= mongoose.model( 'Ticket' )

/**
 * expose route configuration
 */

exports._routes = function( app ){

    app.get(  '/'		, home    )
    app.get(  '/contact'	, contact )
    app.post( '/contact'	, makeContact )
    app.get(  '/privacy'	, privacy )
    app.get(  '/about'          , about )

}

function home( req, res ){
    res.render( 'home/index', { home : 'active'} )
}

function contact( req, res ){
    res.render( 'home/contact', { contact : 'active'} )
}

function makeContact( req, res, next ){
    ticket = new Ticket( req.body )
    if ( req.app.user ) ticket.user = req.app.user
    ticket.save( function( err ){
	if ( err ) return next( err );
	req.flash( 'success', 'Your message has been delivered.' )
	res.redirect( 'back' )
    })
}

function privacy( req, res ){
    res.render( 'home/privacy', { privacy : 'active'} )
}

function about( req, res ){
    fs.readFile( norm( req.app.get( 'root' ) + '/LICENSE' ), function( err, txt ){
	res.render( 'home/about', { 
	    about : 'active'
	    , licenseText : txt
	})
    })
}
