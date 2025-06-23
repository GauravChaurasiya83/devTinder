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
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE} is not valid status`
        },
        required:true
    }
},{timestamps:true})


connectionRequestSchema.index({fromUserId:1, toUserId:1}) //this is compound index which will make the db query very fast  

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("cannot send connection request to yourself!!")
    }
    next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequestModel",connectionRequestSchema)

module.exports = {ConnectionRequestModel}