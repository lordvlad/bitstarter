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

var TwitterStrategy = require( 'passport-twitter' ).Strategy

/**
 * functions
 */


/**
 * twitter does not provide user emails. we need to find another way
 * to securely connect a user to twitter
 */

function connectTwitterUser( user, profile, done ){
    user.profiles = user.profiles || {}
    user.username = user.username || profile.username
    user.name     = user.name     || profile.displayName
    user.provider = !user.provider ? 'twitter' : ( user.provider.push ? user.provider.push('twitter') : [ user.provider, 'twitter' ] )
    user.profiles.twitter = profile._json
    user.save( function( err ){
        if ( err ) return done ( err )
        return done( null, user, { message: 'User connected successfully to twitter.' })
    })
}

function createTwitterUser( User, profile, done ){
    return ( new User({
        name        : profile.displayName
        , username  : profile.username
        , provider  : 'twitter'
        , profiles  : {
            twitter : profile._json
        }
    })).save( function( err, user ){
        if ( err ) return done ( err )
        return done( null, user )
    })
}

/**
 * expose configuring function
 */

exports = module.exports = function createTwitterStrategy( cfg, User ){
    return new TwitterStrategy(
        cfg
        , function( token, tokenSecret, profile, done ){
            // find a user by twitter id
            User.findOne({ 'profiles.twitter.id' : profile.id }, function ( err, user ){
                // forward error if one occurs
                if ( err   ) return done( err )
                // forward user if found
                if ( user  ) return done( null, user )
                // if no existing user found, create user
                if ( !user ) return createTwitterUser( User, profile, done )
            })
        })
}
