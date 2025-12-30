const mongoose=require('mongoose')
const {Schema} =require('mongoose')

const categorySchema=new Schema({
    name:{
        type:'string',
        require:true,
        trim:true,
    },
    status:{
        type:'boolean',
        require:true,
        trim:true,
    }
})
module.exports=new mongoose.model('Category',categorySchema)
