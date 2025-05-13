const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate:function(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Gender is not valid")
            }
        }
        
    },
    skills:{
        type:[String],
    },
    about:{
        type:String,
        default:"this is a default about."
    },
    photoUrl:{
        type:String,
        default:"https://www.shutterstock.com/search/default-user"
    }
},{
    timestamps:true
})


const User = mongoose.model("User",userSchema)

module.exports = {User}