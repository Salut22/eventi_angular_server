var mongoose   = require('mongoose');
//var Bear       = require('../app/models/bear');
var User       = require('../app/models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../config');
//router.route('/bears/:bear_id')

    exports.getUserById = function()   
    {
        return function(req, res){
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        })
}
    }
    exports.updates=function()
    {
     return function(req, res){
    
    User.findById(req.params.user_id, function(err, user){
        
        if(err)
              res.send(err);

            user.name     = req.body.name;    // update the users info
            
            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'user updated!' });
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
                res.json({message:'aaa'});
            else
            res.json({ message: 'Successfully deleted' });
        });
    }
    }
    
    
    

                
exports.authenticate = function()
{ 
    
     return function(req, res) 
     {
        var users =req.body.users;
        console.log(users);
        User.findOne({
        'basic.nickname'    : users.username,
        'basic.password'    : users.password
        })
.then(function (user)
{
    if (!user) {
        var err='Authentication failed. user not found.';
      res.status(400).send({msg:"utente non trovato",error:err})
     // throw new Error('Authentication failed. user not found.');
               }
    if (user.basic.password != req.body.password) 
    {
        var err='Authentication failed. Wrong password.';
        res.status(400).send({msg:"Authentication failed. Wrong password.",error:err})
//        throw new Error('Authentication failed. Wrong password.');
    } 
    else {
        console.log(user);
      //if user is found and password is right create a token
        //res.json({message: user});    
//        var token = jwt.sign(user._id, app.get('superSecret'), {
//            expiresInMinutes: 1440 // expires in 24 hours
//          });
        var paramss ={
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
 //       var token = jwt.sign(user, app.get('superSecret'), {
 //           expiresInMinutes: 1440 // expires in 24 hours
        expiresIn: '36h'
          });
        console.log(token);
        res.status(200).send({msg:"Enjoy your token!",result:user, token: token});    
    }
})
.catch(function(err)
       {
            console.error(err);
            
            res.status(400).send({msg:"utente non autenticato",error:err});
        });
    }
}
   
  
    
    
    
    
    
    
    
   