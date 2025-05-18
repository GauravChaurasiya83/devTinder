const express = require("express")
const requestRouter = express.Router()

const {userAuth} = require("../middlewares/auth")

requestRouter.post("/sendConnection",userAuth,async(req,res)=>{
    //sending connection request
    const user = req.user
    console.log("sent connection request")
    res.send(user.firstName + " has sent connection request")
})


module.exports = requestRouter