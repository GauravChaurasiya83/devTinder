const express = require("express")
const profileRouter = express.Router()

const {userAuth} = require("../middlewares/auth")

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user //ye  req.user middleware se aarha h
        console.log("the logged in user is " + user.firstName);
        res.send(user) 
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
    
})

module.exports = profileRouter