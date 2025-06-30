const express = require("express")
const userRouter = express.Router()
const {userAuth} = require("../middlewares/auth")
const {ConnectionRequestModel} = require("../models/connectionRequest")
const {User} = require("../models/user")
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

userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10

        limit = limit > 50 ? 50 : limit
        const skip = (page-1)*limit

        const loggedInUser = req.user
        
        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()

        connectionRequest.forEach((connectionReq)=>{
            hideUsersFromFeed.add(connectionReq.fromUserId.toString())
            hideUsersFromFeed.add(connectionReq.toUserId.toString())
        })
        //array.from converts the anyother data structure to array(like in this,set is converted to array)
        const users = await User.find({
           $and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},//$nin means not in
                 {_id:{$ne:loggedInUser._id}}
           ]  
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
    
        res.send(users)
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = {userRouter}