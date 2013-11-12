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

var FacebookStrategy = require( 'passport-facebook' ).Strategy

/**
 * functions
 */

function createFacebookUser( User, profile, done ){
    return ( new User({
        name         : profile.displayName
        , email      : profile.emails[0].value
        , username   : profile.username
        , provider   : 'facebook'
        , profiles   : {
            facebook : profile._json
        }
    })).save( function( err, user ){
        if ( err ) return done( err )
        return done( null, user )
    })
}

/**
 * expose configuring function
 */

exports = module.exports = function createFacebookStrategy( cfg, User ){
    return new FacebookStrategy(
        cfg
        , function ( accessToken, refreshToken, profile, done ){
            // find a user by facebook id
            User.findOne({ 'profiles.facebook.id' : profile.id }, function ( err, user ){
                // forward error if one occurs
                if ( err   ) return done( err )
                // forward user if found
                if ( user  ) return done( null, user )
                if ( !user ) return createFacebookUser( User, profile, done )
            })
        })
}
