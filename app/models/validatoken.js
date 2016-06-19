exports.validatoken = function()
{
    return function(req, res, next)
    {
        var idToken;                      //token decoded id 
        var maxCounter          =10;     //max number of counter
        var maxDifferentTime    =10000; //max different of timeReqest and time1log
        var maxDifferentLog     =10000;//max different of timeRequest and timeLastRequest
        var counter;
        var timeRequest         =Date.now();
        var timeLastRequest;
        var differentTime;
        var time1log;
        var differentLog;
   
            if (req.url==='/users/authenticate'||req.url==='/api/users/')
            {
                next('route');
                return;
            }
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            // decode token
            if (token) 
            {
                // verifies secret and checks exp
                jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
                if (err) 
                {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
                } 
                else 
                {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded; 
                    idToken=decoded._doc._id;

                    User.findById
                    ({
                        _id : idToken
                    }) 
            .then(function(user)
            { 
                counter =user.counter;
                time1log =user.time1log;
                timeLastRequest=user.timeLastRequest;
                differentTime = timeRequest-time1log;
           
                if(timeLastRequest==null)
                {
                    timeLastRequest=time1log;
                }
                else
                {
                    differentLog=timeRequest-timeLastRequest;
                }
               if(differentLog > maxDifferentLog)
                {
                    counter=1;
                    user.counter=counter;
                    time1log=timeRequest;
                    user.time1log=timeRequest;
                    user.save();
                }
           
                if(differentTime < maxDifferentTime && counter > maxCounter)
                {
                    console.log ('Accesso non autorizzato');
                    res.json({ message: 'Accesso non autorizzato aspetta '+maxDifferentTime/1000+' secondi hai aspettato ' +differentTime/1000+' secondi'});
                    user.time1log=timeRequest;
                    user.timeLastRequest=timeRequest;
                    user.save();
                }
                else
                {
                   user.timeLastRequest=timeRequest;     
                   counter+=1;
                   user.counter=counter;
                   user.save();     
                   next();
                }
               
            })
            .catch(function(err)
            {
                console.error(err);
            });


            }
    
        });
     }
  }
}