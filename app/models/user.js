var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var defaultUserImg = 'assets/img/icon-user.png';
var defaultGender  = 'm';


/* ====================================
  SCHEMA
====================================*/


// create a schema
var userSchema = new Schema({
  basic   :    {
                name      : { type: String, required: true},
                last_name : { type: String},
                nickname  : { type: String, unique: true,  sparse:true},
                admin     : Boolean,
                time1log  : Number,
                counter   : Number,
                differenzaTempo: Number,
                timeLastRequest: Number,
                bday      : Date,   	    
                email     : { type:String, validate: emailValidator, unique:true,  sparse:true},
                password  : { type: String,  minlength:6},   
},
  
});


/* ====================================
  FUNCTIONS
====================================*/


// example of custom method
userSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};


// on every save, check if credentials are present
userSchema.pre('save', function(next) {

// if (this.fb_id == "" || this.fb_id == null)
//     { delete this['fb_id']; }  // otherwise I will have duplicate 'null'   
    
 if (this.nickname == "" || this.nickname == null)
     { delete this['nickname']; 
     }  // otherwise I will have duplicate 'null'       
    

    
 // I need (email and password) OR (fb_id  and token_for_business )  
 if ( !this.basic  ||  !this.basic.email  || !this.basic.password )
     { var err = new Error('email and password is needed');
       next(err);
    
       return;
     }
    
    
  next(); // OK, proceed the saving process
});


// actually this is not called by findByIdAndUpdate
userSchema.pre('update', function(next) 
 {
  //with update validators, 'required' only fail when explicitly $unset the key.
  //validation operates just with $set and $unset, so it's very limited
  this.options.runValidators = true; 
  next();
});






/* ====================================
  OK
====================================*/


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;



