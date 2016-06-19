var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;




/* ====================================
  SCHEMA
====================================*/
var openHourSchema = new Schema(
{
   days    : String,     // lun
   hour    : String,     // 12:00–15:00, 19:00–22:00
   general : String      // if it's just a generic sentence  
});


// create a schema
var EventDetailSchema = new Schema({
    _id     : {type: Schema.ObjectId, ref: 'Poi', required: true},
    address : {
                title    : String,
                street   : String,
                city     : String,
                country  : String,
                zip      : String,
                state    : String,
                id_place : {type: Schema.ObjectId, ref: 'Poi'}
              },
    contact : {
                email    : { type:String, validate: emailValidator},
                website  : String,
                phone    : String
              },
    open    : {
                hr      : [ openHourSchema ],
                closing : String,             // giorno di chiusura
                holiday : String              // ferie
              },
    rating  : { 
                gl       : {type: Number, min: 0, max: 5},  // google place
                fr       : {type: Number, min: 0, max: 5},  // foursquare
                tripadv  : {type: Number, min: 0, max: 5},  // trip advisor
                bkng     : {type: Number, min: 0, max: 5},  // booking
              },
    other_id: {
                gl       : { type:String,  unique  : true, sparse:true},        // google place
                fb       : { type:String,  unique  : true, sparse:true},        // facebook       
                fr       : { type:String,  unique  : true, sparse:true},        // foursquare
                benicult : { type:String,  unique  : true, sparse:true},        // beniculturali
                tripadv  : { type:String,  unique  : true, sparse:true},        // tripadvisor
                bkng     : { type:String,  unique  : true, sparse:true},        // booking
    movimentoTurismoVino : { type:String},                                      // movimentoTurismoVino
       elenchitelefonici : { type:String},                                      // elenchiTelefonici
             ticket_one  : { type:String},                                      // ticket_one
        eventiesagre_id  : { type:String}                                       // eventi e sagre
              },
 last_update: {
                eppoi   : Number,     
                gl      : Number,    // google place
                fr      : Number,    // foursquare
                benicult: Number,   // beniculturali
                tripadv : Number,    // tripadvisor
                bkng    : Number,    // booking
movimentoTurismoVino    : Number,    // movimentoTurismoVino  
      elenchitelefonici : Number,    //elenchitelefonici
             ticket_one : Number,    //Ticket-one
        eventiesagre_id : Number     //eventi e sagre
              },
    photos  :   [String],
"ph-primary":   String,
    logos   :   [String],
"logo-primary" : String,
    desc    :   String,
related_pois:   [{type: Schema.ObjectId, ref: 'Poi'}], 
    awards  :   [{type:String}],
what_visit  :   {type:String},
    wines   :   [{type:String}],
    fairs   :   [{type:String}],
    price   :   {
                 avg   : String,    // average price
                 fixed : String,    // fixed price
                 prc_info : String, // other info  (Ex. bevande escluse)
                 cards : Boolean    // accepts credit cards, ATM
                },
ticket_office:   {
                 email    : { type:String, validate: emailValidator},
                 website  : String,
                 phone    : String,
                 hr       : String,
                 discount : String
                },
booking:         {
                 required : {type:Boolean},
                 email    : { type:String, validate: emailValidator},                   
                 website  : String,
                 phone    : String
                }
},
{
    timestamps: true
});


/* ====================================
  VIRTUAL FIELDS
====================================*/

EventDetailSchema.set('toJSON',   {virtuals:true});
EventDetailSchema.set('toObject', {virtuals:true});


/* THIS IS NOT WORKING, SO I INJECT primary-review FROM THE ROUTE */
///* get the primary review from the reviews collection */
EventDetailSchema.virtual('primary-review').get(function()
  { 
//    var deferred = q.defer();
//    PoiReviews.findById(this._id)
//        .then(function(doc) {deferred.resolve(doc); });
//    return deferred.promise;
//    
  });




/* ====================================
  FUNCTIONS
====================================*/

EventDetailSchema.pre('save', function(next) 
 { // I must set empty arrays of nested object to undefined
   if (this.open.hr.length==0 && this.open.closing==undefined && this.open.holiday==undefined)
       { this.open = undefined;}

   if (this.photos.length==0)
       { this.photos = undefined;}   
    
  if (this.related_pois.length==0)
       { this.related_pois = undefined;}    
    
  if (this.wines.length==0)
       { this.wines = undefined;}    
    
  if (this.fairs.length==0)
       { this.fairs = undefined;}     

    if (this.awards.length==0)
       { this.awards = undefined;}   
    
    // check the hour if complies my format   12:00–15:00, 19:00–22:00
    if (this.open && this.open.hr && this.open.hr.length>0)
      {
       for (h in this.open.hr)
         {
          var row = this.open.hr[h];
          if (!row.hour) {continue;}
          var hour = row.hour;
          if
            (
             /[0-9]{2}\:[0-9]{2}/.test(hour) ||
             /[0-9]{2}\:[0-9]{2}\–[0-9]{2}\:[0-9]{2}/.test(hour) ||
             /[0-9]{2}\:[0-9]{2}\–[0-9]{2}\:[0-9]{2}\,\s[0-9]{2}\:[0-9]{2}/.test(hour) ||
             /[0-9]{2}\:[0-9]{2}\–[0-9]{2}\:[0-9]{2}\,\s[0-9]{2}\:[0-9]{2}\–[0-9]{2}\:[0-9]{2}/.test(hour)
            )
             { /* ok, I like it*/ }             
          else
            { // move to general
             this.open.hr[h].general = hour;
             this.open.hr[h].hour = undefined;
            }
         }
      }
    
 next();
});



/* ====================================
  OK
====================================*/


// compile the model
var EventDetail = mongoose.model('EventDetail', EventDetailSchema);

// make this available to our users in our Node applications
module.exports = EventDetail;



