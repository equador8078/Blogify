const mongoose=require('mongoose')
const {createTokenForUser, verifyUserToken}= require('../services/authentication')
const { createHmac,randomBytes } = require('crypto');
const userSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type: String,
    },
    password:{
        type:String,
        required:true
    },
    profileImgURL:{
        type:String,
        default:"/images/image.png"
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    }
},{timestamps:true})

userSchema.pre('save',function (next){
    const user=this;

    if(!user.isModified('password')) return;

    const salt=randomBytes(16).toString('hex');
    const hashedPassword=createHmac('sha256',salt)
    .update(user.password)
    .digest('hex')

    this.salt=salt;
    this.password=hashedPassword;

    next()
})

userSchema.statics.matchPasswordAndCreateToken=async function(email, password){
    const  user=await this.findOne({email})
    if(!user) throw new Error("User not found")

        const salt = user.salt;
        const hashedPassword=user.password

        const userProvidedHash=createHmac('sha256',salt)
        .update(password)
        .digest('hex')

        if(hashedPassword!==userProvidedHash) throw new Error("Password not matched")

            const token =createTokenForUser(user)
            return token;
}

const USER=mongoose.model('user',userSchema);

module.exports=USER;
