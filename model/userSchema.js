const mongoose =require('mongoose')
const userSchema =mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    acno:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    transactions:{
        type:Array,
        required:true
    },
})
// create a model
const users= mongoose.model("users",userSchema)

// export model
module.exports =users
