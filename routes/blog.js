const express = require('express')
const BLOG = require('../models/blog')
const COMMENT = require('../models/comments')
const multer = require('multer')
const path=require('path')
const router = express.Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
        const fileName= `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    }
})
const upload = multer({ storage: storage })


router.get('/new-blog', (req, res) => {
    res.render('addBlog', {
        user: req.user
    })
})

router.post('/',upload.single("coverImage"), async (req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const { title, body, coverImageURL } = req.body

    await BLOG.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })
    res.redirect(`/users/`)

})


router.get('/view/:id',async (req,res)=>{
    const blog= await BLOG.findById(req.params.id).populate('createdBy')
    const allComments=await COMMENT.find({blogId:req.params.id}).populate('createdBy')
    res.render('blog',{
        blog:blog,
        user:req.user,
        comments:allComments
    })
})


router.post('/:blogId',async (req,res)=>{
    await COMMENT.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })

    return res.redirect(`/blog/view/${req.params.blogId}`,)
})

router.get('/portfolio/:id',async (req,res)=>{
    const usersBlog= await BLOG.find({createdBy:req.params.id}).populate('createdBy')
    if(usersBlog.length==0){
        return res.render('home',{
            user:req.user,
            noBlog:'No Blogs!!'})
    }
    
    return res.render('home',{
            atPortfoliio:true,
            user:req.user,
            blogs:usersBlog
        })
    
})

router.get('/delete/:blogId',async (req,res)=>{
    try{
        await BLOG.findByIdAndDelete(req.params.blogId)
        res.redirect(`/blog/portfolio/${req.user._id}`)
    }
    catch{
        console.log("Some Error occurred")
    }
})

router.get('/edit/:blogId',async (req,res)=>{
    const blog=await BLOG.findById(req.params.blogId).populate('createdBy')
    res.render('addBlog',{
        blog,
        edit:true,
    })
})

router.post('/editedParams/:blogId',upload.single("coverImage"), async (req,res)=>{
    const {existingImage,title,body}=req.body
    console.log(title,body)
    if (req.file) {
        coverImageURL = `/uploads/${req.file.filename}`
    }
    else{
        coverImageURL=existingImage
    }
    try{
        await BLOG.findByIdAndUpdate(req.params.blogId,{
        coverImageURL,
        title,
        body
    })
    res.redirect(`/blog/view/${req.params.blogId}`)}
    catch(error){
        res.end('Some error occurred',error)
    }
})


module.exports = router