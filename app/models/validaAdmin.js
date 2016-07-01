exports.validaAdmin = function()
{
    return function(req, res, next)
    {
                    console.log(admin);
                    res.status(200).send({msg:"token trovato verifica dello stato ammistratore",result:admin});
                    
     }
}
