/*!
 * cfg/passport.js
 *
 * basic application setup
 *
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */

/**
 * dependencies
 */

var passport		= require( 'passport'              )
    , mongoose          = require( 'mongoose'              )
    , LocalStrategy	= require( 'passport-local'        ).Strategy

/**
 * variables
 */

var User = mongoose.model( 'User' )

/**
 * functions
 */

function serializeUser( user, done ){
    done( null, user._id )
}

function deserializeUser( id, done ){
    User.findOne({ _id: id }, done )
}

function createLocalStrategy( cfg ){
    return new LocalStrategy( {
        usernameField   : 'email'
        , passwordField : 'password'
    }, function ( email, password, done ){
	User.findOne({ email: email }, function( err, user ){
	    if ( err   ) return done( err );
	    if ( !user ) return done( null, false, { message: 'Unknown user' } )
	    user.auth( password, function( err, match ){
		if ( err   ) return done( err        );
		if ( match ) return done( null, user );
		return done( null, false,  { message: 'invalid password' } );
	    })
	})
    })
}

/**
 * expose configuring function
 */

exports = module.exports = function( app ) {

    var cfg   = app.get( 'cfg' )

    app.events.emit( 'passport.begin', 'configuring passport' )

    try {

	passport.serializeUser(   serializeUser   )
	passport.deserializeUser( deserializeUser )

	passport.use( createLocalStrategy(    cfg.passport.local    ) )
	passport.use( require('../lib/passport-google.js'  )( cfg.passport.google,   User ) )
	passport.use( require('../lib/passport-twitter.js' )( cfg.passport.twitter,  User ) )
	passport.use( require('../lib/passport-facebook.js')( cfg.passport.facebook, User ) )

	app.use( passport.initialize() )
	app.use( passport.session()    )

    } catch ( e ) {
	return app.events.emit( 'passport.end.error', e )
    }
    app.events.emit( 'passport.end.ready', 'passport configured' )

}
