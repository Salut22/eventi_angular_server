// server.js

// BASE SETUP
// =============================================================================


// call the packages we need
var express           = require('express');        // call express
    app               =          express();   // define our app using express
var bodyParser        = require('body-parser');
var fs                = require('fs');
var morgan            = require('morgan');
    mongoose          = require('mongoose');
var FileStreamRotator = require('file-stream-rotator'); 
    jwt               = require('jsonwebtoken');
    config            = require('./config');
    q                 = require('q');
   idToken="";
   admin="";
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//=================================================================================
// SET PORT AND MONGOOSE
//=================================================================================
var port = process.env.PORT || 8080;        // set our port
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

//=================================================================================
// SET Models for database
//=================================================================================


Util         = require('./app/models/util');
User         = require('./app/models/user');
Subscribed   = require('./app/models/subscribed');
Event        = require('./app/models/event');
Preferito    = require('./app/models/preferito');


//=============================================================================
// ROUTES FOR OUR API
// =============================================================================
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});


// get an instance of the express Router
var router = express.Router();              
//var bears  = require('./Route/Bears');
var api                = require('./Route/api');
var users              = require('./Route/users');
var loadEvent          = require('./Route/loadEvent');
var validaAdmin        = require('./app/models/validaAdmin');
var event              = require('./Route/events');
var preferito          = require('./Route/preferito');


var router = express.Router();

// set the home route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

validate    = require('./app/models/validatoken');






router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});
app.use(validate.validatoken());

app.get   ('/users/:user_id',      users.getUserById() );
app.put   ('/users/:user_id',      users.updates()     );
app.delete('/users/:user_id',      users.delete()      );
app.get   ('/api/search',          api.search()        );
app.post  ('/api/users',           api.create()        );
app.post  ('/users/authenticate',  users.authenticate());
app.post  ('/admin/loadEvent',     loadEvent.loadEvent());
app.post  ('/admin/validate',      validaAdmin.validaAdmin());
app.post  ('/getEvent',            event.getNearEvents());
app.get   ('/getEvent/:event_id',  event.getEventById());
app.get   ('/getPreferiti/:preferito_id',    preferito.getPreferitoById());
app.post  ('/addEvent',            preferito.addEvent());
app.post  ('/removeEvent',         preferito.deleteEvent());
//=============================================================================
// REGISTER OUR ROUTES -------------------------------
//=============================================================================
// all of our routes will be prefixed with /api
app.use('/api', router);

//==============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);







