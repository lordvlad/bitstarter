var stream = require( 'stream' )


function StreamingImageDecoder( options ){
    options = options || {}
    options.objectMode = options.objectMode || true

    stream.Duplex.call( this, options )

}

require('utils').inherits( StreamingImageDecoder, stream.Duplex )

StreamingImageDecoder.prototype._read = function(){

}

StreamingImageDecoder.prototype._write = function( chunk, encoding, callback ){


}