var mongoose   = require('mongoose');
//var Bear       = require('../app/models/bear');
var Carrello       = require('../app/models/carrello');

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
        console.log(JSON.stringify(req.body));
        var cart=req.body.cart[0];
        Carrello.findById(req.body.userId)
        .then(function(docs)
           {
            if (docs)
            { 
               var trovato=false;
               console.log(JSON.stringify(docs.prodotto[0].details));
               for (i in docs.prodotto)
                {
                    if (cart.details.idEvento==docs.prodotto[i].details.idEvento)
                    {
                        console.log('prima '+docs.prodotto[i].details.quantita);
                        docs.prodotto[i].details.quantita=cart.details.quantita;
                        console.log('dopo '+docs.prodotto[i].details.quantita);
                        trovato = true;
                    }
                }
                console.log(trovato);
                if (trovato == false)
                {   
//                    console.log(req.body.cart[0]);
                    docs.prodotto.push(req.body.cart);
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
               res.status(404).send({ msg: "Cart not found", error: "cart not found" }); 
            } 
          })
       .catch(function(err)
              { console.log('Cart non presente'+err);
                res.status(400).send({ msg: "Bad Request################## Error", error: err.toString() }); 
              });
    }
 }