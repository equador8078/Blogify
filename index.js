require('dotenv').config()

const express=require('express')
const mongoose=require('mongoose')
const path=require('path')
const router=require('./routes/user')
const blogRouter=require('./routes/blog')
const {checkIfCookieExists}=require('./middlewares/authentication')
const cookieParser=require('cookie-parser')
const PORT=process.env.PORT

const app =express()

mongoose.connect("mongodb://localhost:27017/blogify").then(()=>console.log('MongoDB connected!!'))

app.set('view engine','ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkIfCookieExists("token"))
app.use(express.static(path.resolve('./public')))


app.use('/users',router);
app.use('/blog',blogRouter);

app.listen(PORT, ()=>console.log(`Server started at PORT:${PORT}`))