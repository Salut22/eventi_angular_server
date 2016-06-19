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
    var user =req.body.users;
//     console.log(user);
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
        res.status(200).send({msg:"utente salvato con successo",result:true});    
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









// create a bear (accessed at POST http://localhost:8080/api/bears)
//exports.create=function()
//{
// return function(req, res)
// {
//    
//    var bear= new Bear(); // crea una nuova instanza per il modello bear
//    
//    bear.name     = req.body.name, // setta il nome del bear (come da richiesta)
//    bear.password = req.body.password, 
//    bear.admin    = true,
//    bear.time1log = Date.now(),
//    bear.counter= 0,
//    bear.timeLastRequest=null
//   
//    //salva il bear e controlla gli errori 
//    
//    bear.save (function(err)
//    {
//        if (err)
//            res.send(err);
//        
//        res.json({message: 'Orso saved successfully'});
//    });
// }
//}
//
//exports.search = function()
//{
//    return(function(req, res) 
//    {
//       
//        Bear.find(function(err, bear) 
//        {
//            if (err)
//                res.send(err);
//
//            res.json(bear);
//        });
//    });
//}
//
//
//
//
// 