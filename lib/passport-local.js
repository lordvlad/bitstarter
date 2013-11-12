/*!
 * lib/passport-facebook.js
 *
 * passport facebookStrategy setup
 * 
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */

/**
 * dependencies
 */

var passport		= require( 'passport'              )
    , FacebookStrategy	= require( 'passport-facebook'     ).Strategy


function connectFacebookUser( user, profile, done ){
    user.profiles = user.profiles || {}
    user.username = user.username || profile.username
    user.name     = user.name     || profile.displayName
    user.provider = !user.provider ? 'facebook' : ( user.provider.push ? user.provider.push('facebook') : [ user.provider, 'facebook' ] )
    user.profiles.facebook = profile._json
    user.save( function( err ){
	if ( err ) return done ( err )
	return done( null, user, { message: 'User connected successfully to facebook.' })
    })
}

function createFacebookUser( profile, done ){
    return ( new User({
	name		: profile.displayName
	, email		: profile.emails[0].value
	, username		: profile.username
	, provider		: 'facebook'
	, profiles		: {
	    facebook	: profile._json
	}
    })).save( function( err ){
	if ( err ) return done( err )
	return done( null, this )
    })
}


exports = module.exports = function createFacebookStrategy( cfg ){
    return new FacebookStrategy(
	cfg
	, function ( accessToken, refreshToken, profile, done ){
	    var that = this;
	    // find a user by facebook id 
	    User.findOne({ 'facebook.id' : profile.id }, function ( err, user ){
		// forward error if one occurs
		if ( err   ) return done( err )
		// log in user if found
		if ( user  ) return done( null, user )
		// if no user existing user found, find user by email
		if ( !user ) return User.findOne({ 'email' : profile.emails[0].value }, function( err, user ){
		    // forward error if one occurs
		    if ( err   ) return done( err )
		    // if there is a user with the same email address, connect the facebook profile
		    if ( user  ) return connectFacebookUser( user, profile, done.bind(that) )
		    // if there is no user with the same email address, this is a genuinely new user using facebook login
		    if ( !user ) return createFacebookUser( profile, done )
		})
	    })
	})
}

