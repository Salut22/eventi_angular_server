var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = Schema.ObjectId;

/* ====================================
  SCHEMA
====================================*/


// create a schema
var preferitoSchema = new Schema({
    _id            : {type: Schema.ObjectId, ref: 'User', unique:true},
prodotto:   [{
      properties:
                     {
                        title           : {type:String },
                        dateFrom        : {type:Date},
                        dateTo          : {type:Date}
                     },
     details:   {
                // elenchiTelefonici
        idEvento    : { type:String},                                       // _idEvent
        photo       :   String,
        price       : {type:Number, min:0},// other info  (Ex. bevande escluse)
       quantita     : {type:Number, min:0}

        },
    }]
});


/* ====================================
  FUNCTIONS
====================================*/


// example of custom method







/* ====================================
  OK
====================================*/


// the schema is useless so far
// we need to create a model using it
var Preferito = mongoose.model('Preferito', preferitoSchema);

// make this available to our users in our Node applications
module.exports = Preferito;