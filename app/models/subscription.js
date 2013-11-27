var mongoose          = require( 'mongoose' )
    , Schema          = mongoose.Schema

/**
 * Ticket Schema
 */

var SubscriptionSchema =  new Schema({
    email : { type : String, default : '' }
})

mongoose.model( 'Subscription', SubscriptionSchema )
