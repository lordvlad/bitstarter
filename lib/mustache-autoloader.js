/*!
 * mustache-autoloader.js
 *
 * allow mustache to autoload partials from a folder 
 * configured with app.set( 'view partials', dir ).
 * 
 * author:  Waldemar Reusch <waldemar.reusch@googlemail.com> (http://github.com/lordvlad)
 */


/**
 * dependencies
 */

var rfs    = require( 'fs'   ).readFileSync
    , norm = require( 'path' ).normalize

/**
 * variables
 */

var partialsDir      = null
    , viewEngine     = null
    , originalRender = null

/**
 * functions
 */

/**
 * the actual autoloader
 */

function autoLoadPartial ( name ){
    return rfs( norm( partialsDir + '/' + name + '.' + viewEngine ), 'utf-8')
}

/**
 * the replacement for res.render
 * simply extends the options object
 * with our autoloader function
 * before passing it to the original
 * render function.
 */

function renderWithAutoloader ( view, options, callback ){
    options = options || {}
    options.partials = autoLoadPartial
    return originalRender( view, options, callback )
}

/**
 * the injector stashes the original
 * render function, and replaces it 
 * with our custom render function.
 * it also extracts some variables.
 */ 

function injectAutoloader ( req, res, next ){
    originalRender = res.render.bind( res )
    res.render     = renderWithAutoloader
    next()
}

/**
 * expose function as express middleware 
 */

exports = module.exports = function( app ){

    viewEngine     = app.get( 'view engine' ) || 'html'
    partialsDir    = app.get( 'view partials' ) || app.get( 'views' ) + '/partials' || app.get( 'root' ) + '/views/partials'

    app.use( injectAutoloader )
}
