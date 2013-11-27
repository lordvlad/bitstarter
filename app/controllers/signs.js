/**
 * module dependencies
 */

var  _             = require( 'lodash' )
    , http         = require( 'http' )
    , fs           = require( 'fs' )
    , es           = require( 'event-stream' )
    , GifEncoder   = require( 'gifencoder' )
    , PNG          = require( 'png-js' )
    , JPG          = require( 'node-jpgjs' )
    , express      = require( 'express' )
    , mongoose     = require( 'mongoose' )
    , md5          = require( 'md5' )
    , User         = mongoose.model( 'User' )
    , Sign         = mongoose.model( 'Sign' )
    , Word         = mongoose.model( 'Word' )
    , defaultLimit  = 20

function _void(){}

exports._routes = function( app ){

    app.get(  '/gebaerden'                , getAllSigns, signsView     )
    app.get(  '/gebaerden/erstellen'      , createSignView             )
    app.post( '/gebaerden/erstellen'      , createSign                 )
    app.get(  '/gebaerden/fehlende'       , getMissingSigns, signsView )
    app.get(  '/gebaerden/:region'        , signsView, signsView       )
    app.get(  '/gebaerde/:word'           , signsView                  )
    app.get(  '/api/words/:wordquery'     , _void                      )
    app.get(  '/api/regions/:regionquery' , _void                      )

    app.use(  '/tmp', express.static('/tmp/your-signs')                )

    app.param( 'word'                     , findSignsByWord            )
    app.param( 'wordquery'                , findWords                  )
    app.param( 'regionquery'              , findRegions                )
}

function findRegions( req, res, next, regionquery ){
    var reqx = http.get('http://suggestqueries.google.com/complete/search?hl=de&client=chrome&q=deutschland region '+regionquery, function(resx){
        var data = ''
        resx.setEncoding('binary')
        resx.on('data', function(chunk){ data+=chunk})
        resx.on('end', function(err){
            if ( err ) next( err )
            data = JSON.parse(data)[1]
            data = data.map( function(n){ n.replace("deutschland region","") })
            res.json(data)
        })
    }).on('error', next ).end()
}

function findWords( req, res, next, wordquery ){
    var reqx = http.get('http://suggestqueries.google.com/complete/search?hl=de&client=chrome&q='+wordquery, function(resx){
        var data = ''
        resx.setEncoding('binary')
        resx.on('data', function(chunk){ data+=chunk})
        resx.on('end', function(err){
            if ( err ) next( err )
            res.json(JSON.parse(data)[1])
        })
    }).on('error', next ).end()
}

function countSigns( next ){
    Sign.count({},next);
}

function findSigns( word, skip, limit, sort, next ){
    Sign
        .find({word: new RegExp( word, 'i' )})
        .sort(word||'word')
        .skip(skip||0)
        .limit(limit||deafultLimit)
        .exec(next)
}

function findSignsByWord( req, res, next, word ){
    var skip = req.query.skip  || 0
    , limit  = req.query.limit || defaultLimit
    , sort   = req.query.sort  || 'word'

    countSigns(function( err, count ){
        if ( err ) return next( err )
        if ( count < 1 ) return next( new Error( 'Es sind noch keine Gebärden gespeichert.' ))
        findSigns( new RegExp( word, 'i' ), skip, limit, function( err, signs ){
            if ( err )    return next( err )
            if ( !signs ) return next( new Error( 'Keine Gebärden gefunden.'))
            res.signs = signs
            return next();
        })
    })
}

function getAllSigns( req, res, next ){
    var skip = req.query.skip  || 0
    , limit  = req.query.limit || defaultLimit
    , sort   = req.query.sort  || 'word'

    countSigns(function(err, count){
        if ( err ) return next( err )
        if ( count < 1 ) return next( new Error( 'Es sind noch keine Gebärden gespeichert.' ))
        findSigns({}, skip, limit, function( err, signs ){
            if ( err )    return next( err )
            if ( !signs ) return next( new Error( 'Keine Gebärden gefunden.'))
            res.signs = signs
            return next();
        })
    })
}

function getMissingSigns( req, res, next ){

    next()
}


function signsView( req, res ){
    res.render( 'signs/list', {
        signs : res.signs
        , signsList : 'active'
    })
}

function createSignView( req, res ){
    res.render( 'signs/create', {
        title : 'Gebärde erstellen'
        , signsList: 'active'
        , requirejs : [
            'js/createSign'
        ]
        , requirecss : [
            'css/typeahead'
            , 'css/signs'
        ]
    })
}

function createSign( req, res ){

    var encoder = (new GifEncoder( 352, 288 )).createWriteStream({ repeat: 0, delay: 500, quality: 10})
        , decoder = es.map(function(file, next){
            switch ( file.mimetype ){
                case 'image/png' : new PNG( file.buffer ).decode( function(pix){ next( null, pix ) }); break;
                default : next( new Error( 'unsupportetd filetype ' + file.mimetype )); res.send( 415 )
            }
        })
        , collector = es.through(function write (chunk){ this.emit('data', chunk) }, function end (){})
        , counter = 1
        , images = []
        , fields = {}
        , filename = ''

    function random(){
        return md5.digest_s( new Date().toString() + '' + req.ip + ('' + Math.random()) )
    }

    function createGIF(){
        if ( --counter ) return;
        var r  = random()
            , p = '/tmp/your-signs/gif/' + r + '.gif'
            , ws = fs.createWriteStream( p ).on( 'finish', finish )

        filename = '/tmp/gif/' + r + '.gif'
        es.readArray( images ).pipe( decoder.on('error',_void) ).pipe( encoder ).pipe( ws )
    }

    function finish(){
        res.send( filename, 201 )
    }

    function addfield( key, value ){
        fields[ key ] = value;
    }

    function addfile( x, file, y, z, mimetype ){
        ++counter;
        var r = random()
            , p = '/tmp/your-signs/img/' + r + '.png'
            , f = { mimetype : mimetype, buffer : [] }
            , ws = es.through( f.buffer.push.bind(f.buffer), function(){ f.buffer = Buffer.concat(f.buffer);createGIF(); })
        images.push( f )
        file.pipe( ws )
    }

    req.pipe( req.busboy.on('file', addfile).on('field', addfield).on('end', createGIF) )


}