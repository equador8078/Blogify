const jwt=require('jsonwebtoken')
const secret="Hellow"
function createTokenForUser(user){

    const payLoad={
        _id: user._id,
        fullName: user.fullName,
        email:user.email,
        profileImageURL: user.profileImageURL,
        role:user.role,
    }

    const token = jwt.sign(payLoad, secret)

    return token;
}

function verifyUserToken(token){
    const userPayLoad=jwt.verify(token,secret)
    return userPayLoad
}

module.exports={
    createTokenForUser,
    verifyUserToken
}

