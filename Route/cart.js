var mongoose   = require('mongoose');
//var Bear       = require('../app/models/bear');
var Cart       = require('../app/models/carrello');

 exports.getCartById = function()   
    {
        return function(req, res){
        console.log(req.params);
        Carrello.findById(req.params.cart_id)
        .then(function(docs)
           {
            res.status(200).send({ msg: "carrello trovato", result: docs }); 
          })
       .catch(function(err)
              { console.log('Cart non presente'+err);
                res.status(400).send({ msg: "Bad Request  Error", error: err.toString() }); 
              });
    }
 }
 exports.addEvent = function()   
    {
        return function(req, res){
        console.log(req.body);
        Carrello.findById(req.body.userId)
        .then(function(docs)
           {
            if (docs)
            { 
               var trovato=false;
               for (i in docs.prodotto)
                {
                    if (req.body.prodotto.details.idEvento==docs.prodotto[i].details._idEvent)
                    {
                        docs.prodotto[i].details.quantita++;
                        trovato = true;
                    }
                }
                if (trovato == false)
                {
                    docs.prodotto.push(req.body.prodotto);
                }
                 docs.prodotto.save()
                 .then(function(docs)
                 {
                     res.status(200).send({ msg: "prodotto aggiornato" result: docs }); 
                 })
                 .catch(function(err)
                 {
                  res.status(400).send({ msg: "Bad Request  Error", error: err.toString() });   
                 })
            }
            else 
            {
               res.status(404).send({ msg: "Cart not found", error: "cart not found" }); 
            } 
          })
       .catch(function(err)
              { console.log('Cart non presente'+err);
                res.status(400).send({ msg: "Bad Request  Error", error: err.toString() }); 
              });
    }
 }