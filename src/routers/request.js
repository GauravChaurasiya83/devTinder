const express = require("express")
const requestRouter = express.Router()
const {ConnectionRequestModel} = require("../models/connectionRequest")
const {userAuth} = require("../middlewares/auth")
const {User} = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const toUserId = req.params.toUserId
        const status = req.params.status
        const fromUserId = req.user._id

        const allowedStatus = ["interested","ignored"]

        if(!allowedStatus.includes(status)){
            throw new Error("invalid status type")
        }

        const toUser = await User.findById(toUserId)

        if(!toUser){
            res.status(404).json({message:"User not found"})
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            throw new Error("Connection Request Already Exists!!")
        }

        const connectionRequest = new ConnectionRequestModel({toUserId,fromUserId,status})
        const data = await connectionRequest.save()
        res.json({
            message:"connection request  sent successfully!",
            data
        })
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})


module.exports = requestRouter