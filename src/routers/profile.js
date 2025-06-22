const express = require("express")
const profileRouter = express.Router()

const {userAuth} = require("../middlewares/auth")
const {validateProfileEditData} = require("../utils/validation")

const validator = require("validator")
const bcrypt = require("bcrypt")

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

profileRouter.post("/profile/editPassword",userAuth,async(req,res)=>{
    try{

        const {currentPassword, newPassword} = req.body

        const user = req.user
        const hashPassword = user.password
        const isPasswordValid = await bcrypt.compare(currentPassword,hashPassword)
        if(!isPasswordValid){
            throw new Error("Wrong Current Password")
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter a Strong Password")
        }
        console.log("old password hash is " + user.password);
        
        const newPasswordHash = await bcrypt.hash(newPassword,10)
        user.password = newPasswordHash
        user.save()
        console.log("new Password hash is " + newPasswordHash)
        res.send("Password Changed Successfully!!!")

        

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})
 

module.exports = profileRouter