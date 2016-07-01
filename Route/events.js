var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;




exports.getEventById  = function() 
{ 
 return function(req, res)
      {
       // check params
       if (!req.params.id)
           { res.status(400).send({ msg: "Bad Request", error: "missing id" }); return;}
     
       var event_id = req.params.id;
       Event.findById(req.params.id)
        .then(function(doc)
            {
             if (doc)
               { res.status(200).send({ msg: "Event Found", result: doc }); }
             else
               { res.status(202).send({ msg: "Event Not Found", result: undefined }); }
            })
           .catch(function(err)
                {
                 logger.error('[getEventById] '+err);
                 res.status(400).send({ msg: "Bad Request", error: err.toString() });
                });
 }};


/* search for near events (10km). Search for events has a wider max distance. */
exports.getNearEvents  = function() 
{ 
 return function(req, res)
      {
       // take params
       var regione   = req.body.regione;
       var provincia = req.body.provincia;
       var comune    = req.body.comune;
       var da        = req.body.da;
       var a         = req.body.a;
       var query = {};
       if (comune)
           query = { $and: [
                            {'properties.dateFrom':{ $gte: da} },
                            {'properties.dateTo'  :{ $lte: a  } },
                            {'details.address.city': comune.toLowerCase()}
                         ],
                   };
       
     console.log(JSON.stringify(query,null,2));
     Event.find(query)
        .then(function(docs)
           {
              
                      if (docs && docs.length>0)
                        {
                         var length = docs.length;
                         res.status(200).send({ msg: length+" evento Trovato", result: docs }); 
                        }
                      else
                        {res.status(200).send({ msg: "Evento non trovato",  result: [] });  }
          })
       .catch(function(err)
              { console.log('[getNearEvents] '+err);
                res.status(400).send({ msg: "Bad Request  Error", error: err.toString() }); 
              });           
  }
}
