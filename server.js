/*!
 * server.js
 *
 * your signs
 * du hast noch kein gebärdenwörterbuch gefunden, was dir gefällt?
 * dann hilf uns ein neues zu gestalten. mit deinen Gebärden
 *
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 * version: 0.0.1
 */

/**
 * module dependencies
 */

var express	= require( 'express'       )
    , EE2       = require( 'eventemitter2' ).EventEmitter2

/**
 * create application
 */

var app         = exports = module.exports = express()

/**
 * set the rootPath
 */

app.set( 'root', __dirname )

/**
 * log errors, notifications, callbacks
 */
app.events      = new EE2({ wildcard: true })
app.on( 'error', app.events.emit.bind( app.events, 'application.end.error' ))

app.events.on( '*.begin', function( msg ){
    console.log((new Date).toLocaleTimeString(), '', msg, '' )
}).on( '*.progress', function( msg ){
    console.log('       .', '', msg, '' )
}).on( '*.end.ready', function( msg ){
    console.log('       +', '\x1b[32m', msg, '\x1b[0m' ) // green color
}).on( '*.end.error', function( e ){
    console.log('       -', '\x1b[31m', e, '\x1b[0m' )   // red color
    console.log('       -', e.stack )
    process.exit(1)
}).once('start', function(){
    // apply configuration
    require( './cfg/express.js'               )( app )

}).once( 'express.end.ready', function(){
    // enable flash messages
    require( './lib/connect-flash'            )( app )

    // returnTo helper
    require( './lib/returnTo'                 )( app )

    // enable device detection
    require( './lib/express-device'           )( app )

    // enable csrf tokens
    require( './lib/csrf'                     )( app )

    // gain database access
    require( './cfg/mongoose.js'              )( app )

    // configure renderer
    require( './cfg/renderer'                 )( app )

}).once( 'db.end.ready', function(){
    // bootstrap models when database
    // connection is established
    require( './lib/model-bootstrap'          )( app )

}).once( 'models.end.ready', function(){
    // configure passport when
    // models are loaded
    require( './cfg/passport.js'              )( app )

    // enable configuration of require js
    require( './lib/require-js'               )( app )

    // bootstrap controllers when
    // models are loaded
    require( './lib/controller-bootstrap'     )( app )

}).once( 'controllers.end.ready', function(){
    // bootstrap error handling when
    // controller routes are bootstrapped
    require( './lib/errors'                   )( app )

    // some variables for logging
    var name   = app.get( 'pkg'  ).name
        , port = app.get( 'PORT' ) || app.get( 'port' ) || app.get( 'cfg' ).port

    // start application
    app.listen( port )
    app.events.emit( 'application.end.ready', 'application '+ name+' listening on port '+ port )

}).emit('start')
