/**
 * module dependencies
 */

var mongoose		= require( 'mongoose' )
    , User		= mongoose.model( 'User' )
    , pass		= require( 'passport' )
    , _                 = require( 'lodash' )

/**
 * variables
 */

var successRedirect
   , failureRedirect
   , msg = 'Something went wrong while connecting to '

/**
 * expose route configuration
 */

exports._routes = function( app ){

    failureRedirect = app.get( 'login failure redirect' ) || '/login'
    successRedirect   = app.get( 'login success redirect' ) || '/'

    app.get(	'/login'			, login  )
    app.post(	'/login'			, _.partial(auth, 'local' ))
    app.get(	'/signup'			, signup )
    app.post(	'/signup'			, doSignup )
    app.get(	'/logout'			, logout )

    app.get(	'/auth/facebook'		, _.partial(auth, 'facebook' ))
    app.get(	'/auth/facebook/callback'	, _.partial(auth, 'facebook' ))
    app.get(	'/auth/twitter'			, _.partial(auth, 'twitter' ))
    app.get(	'/auth/twitter/callback'	, _.partial(auth, 'twitter' ))
    app.get(	'/auth/google'			, _.partial(auth, 'google' ))
    app.get(	'/auth/google/callback'		, _.partial(auth, 'google' ))

    app.get(    '/profile'                      , ensureAuthenticated, profile )
    app.post(   '/profile'                      , ensureAuthenticated, changeProfile, profile )
    app.get(	'/users/:userId'		, profile )

    app.param(	'userId'			, findById )

}

/**
 * passport authentication middlewares
 */

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.returnTo( req.url )
    res.redirect('/login')
}

function auth( type, req, res, next ){
    var currUser = req.user
        , cfg    = req.app.get( 'cfg' ).passport[ type ]
    res.returnTo( req.referer )
    pass.authenticate( type, cfg, function( err, user, info ){
        if (  err      ) return next( err )
        if ( !user     ) return noUser( req, res, next, info )
        if ( !currUser ) return passLogin( req, res, next, user )
        currUser.profiles[type] = user.profiles[type]
        user.remove( function( err ){
            if ( err ) return next( err )
            return currUser.save( function( err ){
                if ( err ) return next( err )
                return passLogin( req, res, next, currUser )
            })
        })
    })( req, res, next )
}

// handle the event when no user is found

function noUser ( req, res, next, info ){
    // circumvent a bug when using passport with flash
    if ( !req.session.messages ) req.session.messages = {}
    if ( !req.session.messages.error ) req.session.messages.error = []
    req.session.messages.error.push( info.message )
    return res.redirect( failureRedirect )
}

// handles passport's login

function passLogin ( req, res, next, user ){
    req.logIn( user, function( err ){
        if( err ) return next( err )
        return res.redirect( req.returnTo() || successRedirect )
    })
}

// login form

function login ( req, res ){
    res.render( 'users/login', {
	title: 'Log in'
    })
}

// signupForm

function signup ( req, res ){
    res.render( 'users/signup', {
	title: 'Sign up'
    })
}

// logout

function logout ( req, res ){
    req.logout()
    res.redirect( 'back' )
}

// create user

function doSignup ( req, res, next ){
    if ( req.body.password !== req.body.passwordconf ){
	req.session.email = req.body.email
	req.flash( 'error', 'Passwords must match' )
	return res.redirect( 'back' )
    }
    var user = new User( req.body )
    user.provider = 'local'
    user.save( function( err ){
	// if there was an error
	if ( err ) {
	    req.flash( 'error', err.message )
	    return res.redirect( 'back' )
	}
	req.logIn( user, function( err ){
	    if ( err ) return next( err )
	    return res.redirect( req.returnTo() || successRedirect )
	})
    })
}

// show profile

function profile( req, res ){
    var user = req.profile || req.user
    console.log( user )
    res.render( 'users/profile', {
	title: user.name
	, user : user
        , requirejs : [
            'js/profile'
        ]
    })
}

// update profile

function changeProfile( req, res, next ){
    var user = req.user

    // TODO update user

    return user.save( function( err, user ){
        if ( err ) return next( err )
        req.user = user
        return next()
    })
}

// find user by id

function findById ( req, res, next, id ){
    User.findById({ _id : id}, function( err, user ){
	if (  err  ) return next( err )
	if ( !user ) return next( new Error( 'User not found ' + id))
	req.profile = user
	return next()
    })
}

