const express = require("express")
const authRouter = express.Router()

const bcrypt = require("bcrypt")
const { validateSignUpData } = require("../utils/validation")
const { User } = require("../models/user")
const validator = require("validator")

authRouter.post("/signup",async(req,res)=>{
    // console.log(req.body); //printing the incoming JS object(which is converted from json) in the console
    
    //validation of data
    try{
        validateSignUpData(req)

        //encripting the password
        const { firstName,lastName,emailId,password } = req.body
        const passwordHash = await bcrypt.hash(password,10)

        //saving the data to database
        //creating a new user instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        })

        // if(req.body.skills){
        //     const userSkills = req.body.skills
        //     if(userSkills.length>5){
        //     throw new Error("maximum skills input limit reached")
        //     }
        // }
        
        await user.save()
        res.send("data added successfully")
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body

    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid emailId")
    }
    const user = await User.findOne({emailId:emailId})
    if(!user){
        throw new Error("Invalid Credentials")
    }

    const isPasswordValid = await user.validatePassword(password) //this function is also coming userSchema

    if(isPasswordValid){

        //Create a JWT token
        //const token = await jwt.sign({_id:user._id},"devTinder@789",{expiresIn:"2d"}) //iske sath kch galat nhi tha but we can do better
        const token  = await user.getJWT() //this is a better industry level practice
        //this getJWT function is coming from user.js
        console.log(token);
        
        //Add the token to the cookie and send the response back to the user along with this cookie  

        res.cookie("token",token)

        res.send("Login Successfully")
    }

    else{
        throw new Error("Wrong Password")
    }

    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send("logout succesfull!!!")
})


module.exports = authRouter