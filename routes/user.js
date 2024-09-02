const express=require('express')
const USER=require('../models/user')
const BLOG=require('../models/blog')
const router=express.Router()

router.get('/',async (req,res)=>{
    const allBlogs=await BLOG.find({}).populate('createdBy')
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    })
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.get('/signin',(req,res)=>{
    res.render('signin')
})

router.post('/signup', async (req,res)=>{
    console.log("At url",res.body)
    const {fullName, email,password}= req.body

    try{
        await USER.create({
            fullName,
            email,
            password
        })
    }
    catch(errorResponse){
        if(errorResponse.code===11000){
            res.render('signup',{
                Error:'User already exists!'
            })
        }
        else{
            res.send({Error:'Some error occurred, please try again!'})
        }
    }

    return res.redirect("/users/signin")
})

router.post('/signin', async (req,res)=>{
    const {email,password}= req.body

    try{
        const token=await USER.matchPasswordAndCreateToken(email,password);

        return res.cookie('token',token).redirect('/users/')
    }
    catch(err){
        res.render('signin',{
            Error:"Incorrect Email or Password"
        })
    }

})


router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/users/')
})

module.exports=router
