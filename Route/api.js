var mongoose   = require('mongoose');
//var Bear       = require('../app/models/bear');
var User       = require('../app/models/user');

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

// create a User (accessed at POST http://localhost:8080/api/users)

exports.create=function()
{
 return function(req, res)
 {
    console.log('eccomi');
    var user =req.body;
     console.log(req.body);
//    console.log(req.body);
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
    
   
    //salva il user e controlla gli errori 
    newUser.save()
    .then(function(doc)
    {
        console.log(doc);
        console.log(doc._id);
        var preferito=
            {    _id:doc._id
               
            };
        console.log("ziooadj"+preferito);
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

            res.json(user);
        });
    });
}







