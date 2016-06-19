var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;



/* ====================================
  SCHEMA
====================================*/


// create a schema
var subscribedSchema = new Schema(
    {
     email     : { type:String, validate: emailValidator, unique:true}
    },
    {
        timestamps: true
    });


/* ====================================
  FUNCTIONS
====================================*/

/* ====================================
  OK
====================================*/


// the schema is useless so far
// we need to create a model using it
var Subscribed = mongoose.model('Subscribed', subscribedSchema);

// make this available to our users in our Node applications
module.exports = Subscribed;



