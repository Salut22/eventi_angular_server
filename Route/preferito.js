var mongoose   = require('mongoose');
//var Bear       = require('../app/models/bear');
var Preferito       = require('../app/models/preferito');

 exports.getPreferitoById = function()   
    {
        return function(req, res){
        console.log(req.params);
        Preferito.findById(req.params.preferito_id)
        .then(function(docs)
           {
            res.status(200).send({ msg: "preferito trovato", result: docs }); 
          })
       .catch(function(err)
              { console.log('Preferito non presente'+err);
                res.status(400).send({ msg: "Bad Request  Error", error: err.toString() }); 
              });
    }
 }
 exports.addEvent = function()   
    {
        return function(req, res){
        console.log(JSON.stringify(req.body));
        var preferito=req.body.preferiti[0];  
        Preferito.findById(req.body.userId)
        .then(function(docs)
           {
            if (docs)
            { 
               var trovato=false;
               for (i in docs.prodotto)
                {
                    console.log('**********************');
                    if (preferito.details.idEvento==docs.prodotto[i].details.idEvento)
                    {
                        console.log('prima '+docs.prodotto[i].details.quantita);
                        docs.prodotto[i].details.quantita=preferito.details.quantita;
                        console.log('dopo '+docs.prodotto[i].details.quantita);
                        trovato = true;
                    }
                }
                console.log(trovato);
                if (trovato == false)
                {   
//                    console.log(req.body.preferito[0]);
                    
                    docs.prodotto.push(preferito);
                    console.log('if'+docs.prodotto);
                }
                //console.log(JSON.stringify(docs.prodotto,null,2));
                 docs.save()
                 .then(function(docs)
                 {
                     res.status(200).send({ msg: "prodotto aggiornato", result: docs }); 
                 })
                 .catch(function(err)
                 {
                  res.status(400).send({ msg: "Bad Request*************  Error", error: err.toString() });   
                 })
            }
            else 
            {
               res.status(404).send({ msg: "Preferito not found", error: "Preferito not found" }); 
            } 
          })
       .catch(function(err)
              { console.log('Preferito non presente'+err);
                res.status(400).send({ msg: "Bad Request################## Error", error: err.toString() }); 
              });
    }
 }
 
 exports.deleteEvent = function()
 {
    return function(req, res){
        var preferito=req.body;
        console.log(req.body);
        var idPreferito   = preferito.userId;
        var idEvent  = preferito.eventId;
        var trovato  = false;
        Preferito.findById(idPreferito)
        .then(function(docs)
           {
              for (i in docs.prodotto)
                {
                    console.log('**********************');
                    if (idEvent==docs.prodotto[i].details.idEvento)
                    {
                        console.log('prima '+docs.prodotto[i]);
                        docs.prodotto.splice(i,1);
                        console.log('dopo '+docs.prodotto);
                        trovato = true;
                    }
                }
                if(trovato==true)
                {
                  console.log(docs);
                  docs.save()
                 .then(function(docs)
                 {
                     res.status(200).send({ msg: "prodotto aggiornato", result: docs }); 
                 })
                 .catch(function(err)
                 {
                  res.status(400).send({ msg: "Bad Request*************  Error", error: err.toString() });   
                 }) 
                }
                 
          })
       .catch(function(err)
              { console.log('Preferito non presente'+err);
                res.status(400).send({ msg: "Bad Request################## Error", error: err.toString() }); 
              });
        
        
        
        
    } 
 }
 

 
 