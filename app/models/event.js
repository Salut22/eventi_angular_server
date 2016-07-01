var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var fs = require('fs');

var _addSubCategory ; // private function defined later...


/* ====================================
  SCHEMA
====================================*/


// create a schema
var eventSchema = new Schema({
//  type      :    { type:String,	required:true, default:"Feature"},
  geometry  :    {
                   type        : { type:String,	required:true},
                   coordinates : { type: [Number], required:true} // [lng, lat]
                 },
  properties:
                 {
                    title           : {type:String, },
                    "poi-type"      : {type:Number, required:true,},
//                mainCategoriesRating: [{
//                                        mainCategoryId : String,
//                                        rating         : {type: Number, min: 0, max: 5}
//                                      }],
//                subCategoriesRating: [{
//                                        subCategoryId : String,
//                                        rating         : {type: Number, min: 0, max: 5}
//                                      }],                     
//                    mainCategoriesId: {type:[String]},
//                    mainCategories  : {type:[String]},      // labels                     
//                    subCategoriesId : {type:[String]},
//                    subCategories   : {type:[String]},      // labels   
//                  microCategoriesId : {type:[String], required:true},
//                   microCategories  : {type:[String]},      // labels   
//                    dateFrom        : dateSchema,
//                    dateTo          : dateSchema, 
//                    dates           : [dateSchema]
                    dateFrom        : {type:Date},
                    dateTo          : {type:Date},
//                    dates           : [{type:Date}],
                 },
 details:   {
         address : {
                    title    : String,
                    street   : String,
                    city     : String,
                    country  : String,
                    zip      : String,
                    state    : String
                  },
        contact : {
                    email    : { type:String, validate: emailValidator},
                    website  : String,
                    phone    : String
                  },
        other_id: {
                 ticket_one  : { type:String},                                      // ticket_one
                 virgilio    : { type:String}                                       // eventi e sagre
                  },
     last_update: {
                 ticket_one : Number,    //Ticket-one
                 virgilio   : Number     //eventi e sagre
                  },
//        photos  :   [String],
    "ph-primary":   String,
//    "logo-primary" : String,
        desc    :   String,
        price   :   {
                     prc_info : Number, // other info  (Ex. bevande escluse)
                    },
    ticket_office:   {
                     email    : { type:String, validate: emailValidator},
                     website  : String,
                     phone    : String,
                     hr       : String,
                     discount : String
                    },
  
    },
});

/* ====================================
  VIRITUAL FIELDS
====================================*/

eventSchema.set('toJSON',   {virtuals:true});
eventSchema.set('toObject', {virtuals:true});



eventSchema.virtual('properties.dataFromFormatted').get(function()
{  
    var dateStart = this.properties.dateFrom ;
    var yyyy = dateStart.getFullYear();//this.properties.dateFrom.yyyy, this.properties.dateFrom.mm-1, this.properties.dateFrom.dd);
    var mm   = dateStart.getMonth()+1;
    var dd   = dateStart.getDate();
    var hr   = dateStart.getHours();
    var min  = dateStart.getMinutes();
    var sec  = dateStart.getSeconds();
    var data = dd+"-"+mm+"-"+yyyy+" alle ore: "+hr+":"+min;
    return data;
});
eventSchema.virtual('properties.dateToFormatted').get(function()
  { 
   var dataEnd = this.properties.dateTo ;
    var yyyy = dataEnd.getFullYear();//this.properties.dateFrom.yyyy, this.properties.dateFrom.mm-1, this.properties.dateFrom.dd);
    var mm   = dataEnd.getMonth()+1;
    var dd   = dataEnd.getDate();
    var hr   = dataEnd.getHours();
    var min  = dataEnd.getMinutes();
    var sec  = dataEnd.getSeconds();
    var data = dd+"-"+mm+"-"+yyyy;

    return data;
  });
/* ====================================
  FUNCTIONS
====================================*/


eventSchema.pre('save', function(next) 
 { // I must set empty arrays of nested object to undefined

   if (this.details.photos.length==0)
       { this.details.photos = undefined;}         
    
    // check the hour if complies my format   12:00–15:00, 19:00–22:00
    
    
 next();
});

/* ====================================
  OK
====================================*/


// the schema is useless so far
// we need to create a model using it
var Event  = mongoose.model('Event', eventSchema);

// make this available to our users in our Node applications
module.exports = Event;



