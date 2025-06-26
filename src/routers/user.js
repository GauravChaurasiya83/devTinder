const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const {ConnectionRequestModel} = require("../models/connectionRequest")
const { connections } = require("mongoose")

const USER_SAFE_DATA = "firstName lastName age gender skills about"

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{

        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        res.json({
            message:"data fetched succesfully!",
            data:connectionRequest
        })

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})



userRouter.get("/user/conections",userAuth,async(req,res)=>{
    try{

        const loggedInUser = req.user
        const connections = await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ],
            status:"accepted"
        }).populate("toUserId",USER_SAFE_DATA).populate("fromUserId",USER_SAFE_DATA)

        //console.log(connections);
        

        const data = connections.map((row)=>{
            if(row.toUserId._id.toString() === loggedInUser._id.toString()){
                return row.fromUserId
            }
            return row.toUserId
        })


        res.json({message:"connections fetched successfully",data})

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = {userRouter}