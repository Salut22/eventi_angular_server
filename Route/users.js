var mongoose   = require('mongoose');
var User       = require('../app/models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../config');

    exports.getUserById = function()   
    {
        return function(req, res)
        {
            User.findById(req.params.user_id, function(err, user) 
            {
                if (err)
                    res.send(err);
                res.status(200).send({msg:"utente trovato",result:user});
            })
        }
    }
    
    exports.updates=function()
    {
     return function(req, res)
     {
    
        User.findById(req.params.user_id, function(err, user){
        
        if(err)
              res.send(err);

            user.name     = req.body.name;    
            
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.status(200).send({ message: 'user updated!',result:user.name });
            });

        });
    }
    }

    exports.delete = function()
    {
        return function(req, res) {
        User.remove({
            _id: req.params.User_id
        }, function(err, user) {
            if (err)
                res.send(err);

            if (user === 0)
                res.status(400).send({result:"user non trovato"});
            else
            res.status(400).send({ msg: 'user cancellato con successo' });
        });
    }
    }
    
    
    

                
exports.authenticate = function()
{ 
    
     return function(req, res) 
     {
        var users =req.body;
        User.findOne
        ({
            'basic.nickname'    : users.username,
            'basic.password'    : users.password
        })
        .then(function (user)
        {
            if (!user) 
            {
                var err='Autenticazione fallita, utente non trovato';
                res.status(400).send({msg:"utente non trovato",error:err});
            }
            if (user.basic.password != req.body.password) 
            {
                var err='Autenticazione fallita. Password errata';
                res.status(400).send({msg:"Autenticazione fallita. Password errata",error:err})
            } 
            else 
            {
                var paramss =
                {
                    _id     : user._id,
                    basic   :    {
                                    time1log        : user.basic.time1log,
                                    counter         : user.basic.counter,
                                    differenzaTempo : user.basic.differenzaTempo,
                                    timeLastRequest : user.basic.timeLastRequest,
                                    admin           : user.basic.admin
                                 }   
                };
                var token  = jwt.sign(paramss, app.get('superSecret'), {
                expiresIn: '36h'
                  });
                res.status(200).send({msg:"Token!",result:user, token: token});    
            }
        })
        .catch(function(err)
           {
                console.error(err);

                res.status(400).send({msg:"utente non autenticato",error:err});
            });
    }
}