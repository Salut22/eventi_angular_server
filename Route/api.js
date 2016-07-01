var mongoose   = require('mongoose');
var User       = require('../app/models/user');


exports.create=function()
{
 return function(req, res)
 {
    var user =req.body;
    var newUser= new User( // crea una nuova instanza per il modello user
    {
     basic:
        {
             'name'     :user.nome,
             'last_name':user.cognome,
             'email'    :user.email,
             'nickname' :user.username,
             'password' :user.password,
             'bday'     :user.data,
             'admin'    : false,
             'time1log' : Date.now(),
             'counter'  : 0,
             'timeLastRequest':null
        },
    });
    
   
    //salva l'utente e controlla gli errori 
    newUser.save()
    .then(function(doc)
    {
     var preferito=
            {    
                _id:doc._id
            };
        
        var newPreferito = new Preferito(preferito);
        newPreferito.save()
        .then(function(doc_preferito)
        {
            res.status(200).send({msg:"preferito e utente salvati con successo",result:doc});
        })
        .catch(function(err)
        {
             res.status(403).send({ msg: "Preferito non creato", result: doc }); 
        })
     
    })
    .catch(function(err)
    {
        console.log(err);
        res.status(400).send({msg:"utente non salvato",error:err});    
    
    })
    
    
 }
}

exports.search = function()
{
    return(function(req, res) 
    {
       
        User.find(function(err, user) 
        {
            if (err)
                res.send(err);

            res.status(200).send({result:user});
        });
    });
}
