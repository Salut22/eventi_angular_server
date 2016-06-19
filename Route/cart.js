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