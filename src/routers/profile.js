const express = require("express")
const profileRouter = express.Router()

const {userAuth} = require("../middlewares/auth")
const {validateProfileEditData} = require("../utils/validation")

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user = req.user //ye  req.user middleware se aarha h
        console.log("the logged in user is " + user.firstName);
        res.send(user) 
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
    
})

profileRouter.post("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid Edit Requests")
        }
        const loggedInUser = req.user
        
        
        Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]))

        await loggedInUser.save()

        res.json({
            message:`${loggedInUser.firstName}} , you have updated your profile successfully!!`,
            data:loggedInUser
        })
        

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

 

module.exports = profileRouter