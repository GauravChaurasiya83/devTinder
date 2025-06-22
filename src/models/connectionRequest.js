const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.ObjectId,
        required: true
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignore","accepted","rejected"],
            message:`{VALUE} is not valid status`
        }
    }
},{timestamps:true})

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema)