var mongoose = require( 'mongoose' )
    , Schema = mongoose.Schema


var WordSchema = new Schema({

    word       :  { type: String }
    , _related : [{ type : Number, ref : 'Word' }]

})

mongoose.model( 'Word', WordSchema )