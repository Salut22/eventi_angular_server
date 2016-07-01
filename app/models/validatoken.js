

exports.validatoken = function()
{
    return function(req, res, next)
    {
                             //token decoded id 
        var maxCounter          =10;     //max number of counter
        var maxDifferentTime    =10000; //max different of timeReqest and time1log
        var maxDifferentLog     =10000;//max different of timeRequest and timeLastRequest
        var counter;
        var timeRequest         =Date.now();
        var timeLastRequest;
        var differentTime;
        var time1log;
        var differentLog;
        var url=[];
        var matching=req.url;
        var token;
        var tokenUrl;
   
       // console.log("sono in ValidaToken"+JSON.stringify(req.body));
//            if (req.url==='/users/authenticate'||req.url==='/api/users/')
//            {
//                next('route');
//                return;
//            }
        try{url=req.url.split('?');}
        catch(e){};
        console.log(url[0]);
        if (matching.match(/\/getPreferiti\/[a-z0-9]/)!=null)
        {
            url = "/getPreferiti/:preferito_id";
            tokenUrl=req.url.split("/");
            tokenUrl=tokenUrl[2];
            console.log("trovato"+url);
        }
        else
        {
           url=url[0].trim();
        }
        if (url!='/addEvent' && url!='/removeEvent' && url!='/getPreferiti/:preferito_id')
        {
                  console.log('diverso da addEvent');
                  next('route');
                  return;
        }
            
//            if (req.url=='/addEvent')
//            {
//                console.log('diverso da addEvent');
//                next('route');
//                return;
//            }
           
            token = tokenUrl || req.query.token || req.headers['x-access-token'];
           // console.log(token);
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
                    //console.log(req.decoded);
                    //idToken=decoded._doc._id;
                    idToken=decoded._id;
                   // console.log(idToken);
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
    else
    {
        console.log("porco latro");
    }
  }
}