exports.validaAdmin = function()
{
    return function(req, res, next)
    {
        var idToken;                      //token decoded id 
        var admin;

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
                    admin  =decoded._doc.basic.admin;
                    console.log(admin);
                    res.status(200).send({msg:"token trovato verifica dello stato ammistratore",result:admin});
 
            

            }
    
        });
     }
       else
       {
           admin=false;
           res.status(200).send({msg:"token non trovato",result:admin});
       }
  }
}