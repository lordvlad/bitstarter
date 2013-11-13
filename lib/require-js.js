

var config = require( '../requirejs.json' )
    , al   = "abcdefghijklmn"


exports = module.exports = function( app ){

    app.get( '/config.js', function( req, res ){
        res.type( 'application/javascript' )
            .send( 'requirejs.config(' + JSON.stringify( config ) + ');'
                   + 'require('
                   + JSON.stringify( config['require always' ] )
                   + ', function('
                   + al.slice(0, config['require always'].length).split('').join(',')
                   + '){});'
                   + ( !req.query.require ? '' :
                       'require('
                       + JSON.stringify( req.query.require )
                       + ', function('
                       + al.slice(0, req.query.require.length).split('').join(',')
                       + '){});' )
                 )
    })
}
