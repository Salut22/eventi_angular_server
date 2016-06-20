var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var numRandom    = Math.round(4*Math.random());
var mkpath       = require('mkpath');
var request      = require('request');
var fs           = require('fs');
var q            = require('q');


var CITY_FOLDER               = './scrape/scrape_results/';
var POIS_NOT_SAVED            = 'pois_not_saved.txt';
var EXISTING_EVENTS_REMOVED   = 'existing_events_removed.txt';
var EVENT_SAVE_LOG            = 'event_save_log.txt';
var EVENT_REVIEW_SAVE_LOG     = 'EVENT_REVIEW_SAVE_LOG.txt';
var EVENT_DETAIL_SAVE_LOG     = 'EVENT_DETAIL_SAVE_LOG.txt';
var EVENTS_WITHOUT_ADDRESS   = 'events_without_address.txt';
var risposta={};
risposta.titoloPresente=[];
risposta.idPresente=[];
risposta.salvati=[];

exports.loadEvent = function()
{
 return function(req, res)
 {
    console.log('loadEvent');
    var jsonPois         = req.body.jsonPois;
    var city             = req.body.city;
    var SCRAPED_OTHER_ID = req.body.other_id;
    var result_msg = {};
     
    // check input params 
    if (!jsonPois || jsonPois.length<=0 ||
        !city     || city.trim()==""           ||
        !SCRAPED_OTHER_ID || SCRAPED_OTHER_ID.trim()==""
        ) 
     {
        var error = "provide jsonPois, city, other_id. If a unique other_id is not used, set it to 'none'.";
        res.status(400).send({ msg: "Bad request", error: error }); 
        return;
     };
    
    city = CITY_FOLDER+city+"/";

    console.log("percorso: "+city);
        if (!fs.existsSync(city)){
            mkpath(city, function (err) {
                if (err) throw err;
                console.log('Directory '+city+'created');
            });
        };
    mkpath.sync(city); 
    var all_events    = [];
    var all_detpois = [];   
    var all_revpois = [];        

/*============================================================
LOAD THE ARRAYS OF POIS, DETAILS AND REVIEWS
========================================================*/      
     
       fromJsonToSchema(jsonPois)
         // load arrays divided in poi, details and reviews
        .then(function(arrays)
            {
             all_events  = arrays.all_events;
             console.log(all_events.length+"  EVENT FOUND");
             })
       .catch(function(err){
                            console.log('load arrays '+err);
                            res.status(400).send({ msg: "Error", error: err.toString() });
                            return;
                           })
/*============================================================
CHECK FOR TWINS BY NAME AND COORDINATES IN THE ARRAY
======================================================== */
       
        .then( // check for twins by name and coordinates
              function(data)
               {
                var all_events2 = [];
                var found; var cont = 0;
                  for(p=0; p<all_events.length;p++)
                   {  
                     var event = all_events[p];
                     found=undefined;
                     for(c=0; c<all_events.length; c++)
                      {
                       var event2 = all_events[c];
                       if (c!=p) // controllo indici diversi per  non controllare lo stesso
                        {
                            // controllo titolo, dateFrom, dateTo e coordinate
                            if(event.properties.title!=event2.properties.title && event.properties.dateFrom!=event2.properties.dateFrom && event.properties.dateTo!=event2.properties.dateTo && event.geometry.coordinates!=event2.geometry.coordinates)
                            {
//                            console.log("non esiste già nel json");
                          
                            }
                            else
                            {
                            found = true;
                            all_events.splice(c,1);

                            }
                        }
                       
                      }
                   }
                   return all_events;
               })
        .catch(function(err){
            console.log('twins check '+err);
            throw err;
        })

/*============================================================
CHECK FOR TWINS BY NAME 
========================================================*/ 
       
        .then( // check for twins by name and coordinates
              function(all_events)
               {
                var isTwinPromises = [];
                  for(p in all_events)
                   {        
                     var event = all_events[p];
                     // check if the title, the coordinates, and the dateFrom and the dateTo is already exists
                     isTwinPromises.push( 
                         Event.findOne({$and:[
                                            {'properties.title'     : event.properties.title},
                                            {'properties.dateFrom'  : event.properties.dateFrom},
                                            {'properties.dateTo'    : event.properties.dateTo}
                                           ]
                                     })
                       .then(function(doc)
                             {
                              if(doc) {
                                       
                                       risposta.titoloPresente.push(doc.properties.title);
                                       return true;
                                      }
                              else    {return false;}
                             }) 
                        .catch(function(err){console.log('[twins by name] '+err);})                         
                                         );
                   }
                   return q.all(isTwinPromises);
               })
       .catch(function(err){
                            console.log('twins check '+err);
                            throw err;
                           })
 
/*============================================================
CHECK FOR TWINS BY OTHER_ID
========================================================*/ 
       
         .then( 
              function(isTwinList)
               {
                console.log(JSON.stringify(isTwinList));
                // if unique SCRAPED_OTHER_ID is not used, I skip these controls
                if (SCRAPED_OTHER_ID.toLowerCase().trim() == "none")
                    {return isTwinList;}
                   
                var isTwinPromises = [];
                  for(d in all_events)
                   {      
                    if (isTwinList[d])
                        { // I already know it's a twin by name & coords
                          all_events[d]    = {};
                          // push 'true', it's a twin
                          var deferred = q.defer();
                          deferred.resolve(true);
                          isTwinPromises.push(deferred.promise);
                          continue;
                        }                       
                     var detail = all_events[d].details;
                     var key;   // has the other_id according to the scrape
                     var value;
                     if (detail.other_id) 
                      {
                       key = SCRAPED_OTHER_ID;
                       value = detail.other_id[key];
                      }
                     if(key && 
                        value!='true' &&
                        value!='yes'
                       )
                         { 
                          var value = detail.other_id[key];
                          
                          key = "other_id."+key;
                          var query  = {};
                          query[key] = value; 
                          isTwinPromises.push(
                          Event.findOne(query)
                               .then(function(doc)
                                     {
                                      if(doc) {
                                            risposta.idPresente.push(JSON.stringify(doc.details.other_id));
                                               return true;
                                              }
                                      else    {return false;}
                                     }) 
                               .catch(function(err){console.log('[twins by other_id] '+err);})
                                                );                             
                           
                         }
                     else
                         { // no other_id... I can't know if it's a twin
                          // push 'false' 
                          var deferred = q.defer();
                          deferred.resolve(false); // false = not twin
                          isTwinPromises.push(deferred.promise);                             
                         }
                   }
                   return q.all(isTwinPromises);
               })
       .catch(function(err){
                            console.log('[twins other_id check] '+err);
                            throw err;
                           })      
       

       
/*============================================================
SAVE EVENTS TO THE DB
========================================================*/     
       
        // save events to the db           
        .then(
            function(isTwinList)
             {
              console.log('cerco di salvare '+all_events.length+' eventi');
              var event_save_promises = [];
              var contatore=0;
              for(p in all_events)
               {
                if (isTwinList[p])
                    {
                      all_events[p]  = undefined;
                      // push {} just to preserve the arrays length
                      var deferred = q.defer();
                      deferred.resolve({});
                      event_save_promises.push(deferred.promise);
                      continue;
                    }

                var event = all_events[p];
                contatore++;
                               event_save_promises.push(event.save()           
                                            .then(function(doc)
                                                {
                                                  risposta.savati.titolo=doc.properties.title;
                                                  risposta.savati.id=doc._id;
                                                 fs.appendFile(city+EVENT_SAVE_LOG,  
                                                               doc._id+'  '+doc.properties.title+'\n\n');
                                                  return doc;
                                                })
                                            .catch(function(err)
                                                  {console.log('event  NOT SAVED'); 
                                                   fs.appendFile(city+EVENT_SAVE_LOG,  
                                                     ' #### NOT SAVED ####  '+err+'\n\n');
                                                    return {};
                                                  })
                                       );
               }
              risposta.salvati=contatore +" eventi salvati con successo";
              res.status(200).send({ msg: contatore+' eventi salvati con successo' , result: risposta });
             })
       .catch(function(err){console.log('save pois '+err);  })       

 }}




function fromFileToJson (file_name)
{
 var deferred = q.defer();
 fs.readFile(file_name,'utf8', function read(err, data) 
    {
     if (err) 
        { deferred.reject(err); }
     else
      {   
         var jsonPois = data;
         try
            { 
             jsonPois=JSON.parse(content); 
             deferred.resolve(jsonPois);
            } 
         catch(err)
            {
             console.log('[fromFileToJson] '+err); 
             deferred.reject(err);
            };
        }
    });
 return deferred.promise;
}


function fromJsonToSchema (jsonPois)
{ 
 var deferred = q.defer(); // actually I don't need a promise... but I want to use .then              
 // load pois and details                              
 var all_events    = []; 
                        
 for(i in jsonPois)
  {
   var event = jsonPois[i];
      
    // prepare EVENT
    var newEvent = Event(
      {
        type      : "Feature",
        geometry  : event.geometry,
        properties: event.properties,
        details   : event.details
       });
     newEvent.geometry.type = "Point"; 
      
  all_events.push(newEvent);

   }
 deferred.resolve({'all_events':all_events});
 return deferred.promise;
}
