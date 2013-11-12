/*!
 * app/models/ticket.js
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
    , ObjectId        = Schema.Types.ObjectId

/**
 * Ticket Schema
 */

var TicketSchema =  new Schema({
    message		: { type : String, default : '' }
    , status		: { type : String, default : '' }
    , timestamp		: { type : String, default : '' }
    , user              : { type : ObjectId, ref : 'UserSchema' }
})

/**
 * pre-save hook
 */

TicketSchema
    .pre( 'save', function( next ){
	this.timestamp = new Date()
	next()
    })

mongoose.model( 'Ticket', TicketSchema )
