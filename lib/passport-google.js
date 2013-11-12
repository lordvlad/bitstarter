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

var GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy

/**
 * functions
 */

function createGoogleUser( User, profile, done ){
    ( new User({
        name       : profile.displayName
        , email    : profile.emails[0].value
        , username : profile.username
        , provider : 'google'
        , profiles : {
            google : profile._json
        }
    })).save( function( err, user ){
        if ( err ) return done ( err )
        return done( null, user )
    })
}

/**
 * expose configuring function
 */

exports = module.exports = function createGoogleStrategy( cfg, User ){
    return new GoogleStrategy(
        cfg
        , function( accessToken, refreshToken, profile, done ){
            // find a user by google id
            User.findOne({ 'profiles.google.id' : profile.id }, function ( err, user ){
                // forward error if one occurs
                if ( err   ) return done( err )
                // forward user if found
                if ( user  ) return done( null, user )
                if ( !user ) return createGoogleUser( User, profile, done )
            })
        })
}

