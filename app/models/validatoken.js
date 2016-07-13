

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
   
        try{    url=req.url.split('?');     } catch(e){};
        
        if (matching.match(/\/getPreferiti\/[a-z0-9]/)!=null)
        {
            url = "/getPreferiti/:preferito_id";
            tokenUrl=req.url.split("/");
            tokenUrl=tokenUrl[2];
            //console.log("trovato"+url);
        }
        else
        {
           url=url[0].trim();
        }
        if (url!='/addEvent' && url!='/removeEvent' && url!='/getPreferiti/:preferito_id' && url!='/admin/validate')
        {
                  next('route');
                  return;
        }

           
            token = tokenUrl || req.query.token || req.headers['x-access-token'];
            if (token) 
            {
                // inserisce la chiave di sicurezza per decodificare il token
                jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
                if (err) 
                {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });    
                } 
                else 
                {
                    // se è andato tutto bene qui abbiamo il token decodificato
                    req.decoded = decoded;
                    idToken=decoded._id;
                    console.log(JSON.stringify(decoded,null,2));
                    admin=decoded.basic.admin;
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
        res.status(404).send({msg:"token non trovato",result:"accesso negato"})
    }
  }
}