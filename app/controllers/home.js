/**
 * module dependencies
 */

var norm           = require( 'path' ).normalize
    , fs           = require( 'fs' )
    , mongoose     = require( 'mongoose' )
    , User         = mongoose.model( 'User' )
    , Ticket       = mongoose.model( 'Ticket' )
    , Subscription = mongoose.model( 'Subscription' )

/**
 * expose route configuration
 */

exports._routes = function( app ){

    app.get(  '/'		, home    )
    app.get(  '/contact'	, contact )
    app.post( '/contact'	, makeContact )
    app.post( '/subscribe'      , makeSubscription )
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
	req.flash( 'success', 'Deine Nachricht wurde versendet.' )
	res.redirect( 'back' )
    })
}

function makeSubscription( req, res, next ){
    (new Subscription( req.body )).save( function( err ){
        if ( err ) return next( err );
        req.flash( 'success', 'Danke für das Abbonieren.' )
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
