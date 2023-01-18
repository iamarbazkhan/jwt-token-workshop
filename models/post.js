const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:"Username is required field",
    },
    password:{
        type:String,
        required:"Password is required field",
        
    }
})

module.exports= mongoose.model("User", userSchema)