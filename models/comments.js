const mongoose=require('mongoose')
const { type } = require('os')

const commentSchema= mongoose.Schema({
    content:{
        type: String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    blogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blog"
    }
},{timestamps:true})

const COMMENT=mongoose.model('comment', commentSchema)

module.exports=COMMENT;