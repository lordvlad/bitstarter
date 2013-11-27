var mongoose  = require( 'mongoose' )
    , Schema = mongoose.Schema


var SignSchema = new Schema({

    _creator   :  { type: Number, ref: 'User'  }
    , _words   : [{ type: Number, ref: 'Word'   }]
    , _regions : [{ type: Number, ref: 'Region' }]
    , _related : [{ type: Number, ref: 'Sign'   }]
    , image    :  { type: String }

})

mongoose.model( 'Sign', SignSchema )