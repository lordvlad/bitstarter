/*!
 * app/models/user.js
 *
 * Mongoose User model
 *
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */

/**
 * dependencies
 */

var mongoose          = require( 'mongoose' )
    , Schema          = mongoose.Schema
    , bcrypt          = require( 'bcrypt-nodejs' )
    , SALT_WORK_FACTOR= 10


/**
 * User Schema
 */

var UserSchema =  new Schema({
    name                : { type : String, default : '' }
    , email             : { type : String, default : '' }
    , username          : { type : String, default : '' }
    , displayname       : { type : String, default : '' }
    , provider          : { type : String, default : '' }
    , password          : { type : String, default : '' }
    , authToken         : { type : String, default : '' }
    , image             : { type : String, default : 'http://media.salon.com/2013/01/Facebook-no-profile-picture-icon-620x389.jpg' }
    , profiles          : {
        google          : {}
        , twitter       : {}
        , facebook      : {}
    }
})

// make sure emails are unique
UserSchema
    .path( 'email' )
    .validate( function ( email, done ){
        // check for unique emails if no provider is set,
        // if the user is new, or if he changed his email
        if ( this.provider.length === 0 && ( this.isNew || this.isModified( 'email' ) ))
            return User.find({ email: email }).exec( function ( err, users ){
                done( !err && users.length === 0 )
            })
        return done( true )
    }, 'Email already exists.' )

/**
 * pre-save hook
 */

UserSchema
    .pre( 'save', function( next ){
        var user = this;
        user.displayname = user.name || user.username || user.email

        if(!user.isModified('password')) return next();

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(){}, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    })

/**
 * methods
 */

UserSchema.methods = {

    /**
     * authenticate - check if passwords are the same
     *
     * @param {String} pwd
     * @return {Boolean}
     */

    auth : function ( pwd, done ){
        bcrypt.compare(pwd, this.password, done);
    }
}


mongoose.model( 'User', UserSchema )
