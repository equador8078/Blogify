const {verifyUserToken} =require('../services/authentication')
function checkIfCookieExists(cookieName){
    return(req,res,next)=>{
        const token= req.cookies[cookieName];
        if(!token) return next()

        try{
            const userPayLoad=verifyUserToken(token)
            req.user=userPayLoad;
        }
        catch(err){}
        return next()
    }
}

module.exports={
    checkIfCookieExists
}