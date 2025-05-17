const express = require("express")

const app = express()

const { connectDB } = require('./config/database')
const { User } = require("./models/user")

const { validateSignUpData } = require("./utils/validation")

const validator = require("validator")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth")

// const { adminAuth, userAuth } = require('./middlewares/auth')

// //this will only handle GET call to /user
// app.get("/user",(req,res)=>{
//     res.send({"firstname":"Gaurav","lastname":"Chaurasiya"})
// })

// app.post("/user",(req,res)=>{
//     //saving the data to db 
//     res.send("Data of user save successfully to database")
// })

// app.delete("/user",(req,res)=>{
//     //deleting the data to db 
//     res.send("Data of user deleted successfully to database")
// })

// // this will match all HTTP method API calls to /test
// app.use("/test",(req,res)=>{
//     res.send("hello from the server")
// })

///////////////////////////

//GET /users => middleware chain => request handler

// app.use("/",(req,res,next)=>{
//     console.log("handling / route");
//     next()
    
// })

// app.use("/user",(req,res,next)=>{
//     console.log("Handling the route user!");
//     next()
// },
// (req,res,next)=>{
//     console.log("Handling the route user 2!");
//     res.send("2nd response")
// },
// (req,res,next)=>{
//     console.log("Handling the route user 3!");
//     res.send("3rd response")
// }
// )

/////////////////////////////////////////

// app.use("/admin",adminAuth)
// app.use("/user",userAuth)

// app.get("/user",(req,res)=>{
//     //logic for sending data from db
//     res.send("user data sent")
// })

// app.get("/admin/getAllUsers",(req,res)=>{
//     //logic for sending data from db
//     res.send("all data sent")
// })
// app.get("/admin/deleteUser",(req,res)=>{
//     //logic for deleting data from db
//     res.send("deleted user")
// })

///////////////////////////

//Error Handling
// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("something went wrong")
//     }
// })
// app.get("/getUserData",(req,res)=>{
//     throw new Error("sdsdsdsadsa");
//     res.send("User data sent")
// })
// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("something went wrong")
//     }
// })


//////////////////////////////////////
//these following apis were only for practice.


//get(fetching) one user by anyone parameter like emailId
// app.get("/user",async(req,res)=>{
    
//     //this is "findById"
//     try{
//         const users = await User.findById("68239ce9b808d28e5ea8eef2")
//         if (users.length===0){
//             res.status(404).send("user not found")
//         }
//         else{
//             res.send(users)
            
            
//         }
//     }
//     catch(err){
//         res.status(400).send("something went wrong")
//     }
//     //this is "find (by providing any filter)"
//     // const userEmail = req.body.emailId
//     // try{
//     //     const users = await User.find({emailId:userEmail})
//     //     if (users.length===0){
//     //         res.status(404).send("email not found")
//     //     }
//     //     else{
//     //         res.send(users)
//     //     }
//     // }

//     // catch(err){
//     //     res.status(400).send("something went wrong")
//     // }
// })
// // get all the user profiles from database (feed api)
// app.get("/feed",async(req,res)=>{
//     try{
//         const users = await User.find({})
//         res.send(users)
//     }
//     catch(err){
//         res.status(400).send("something went wrong")
//     }
// })

// //delete a user from database
// app.delete("/user",async(req,res)=>{
//     const userId = req.body.userId
//     try{
//         const users = await User.findByIdAndDelete(userId) //or we also use await User.findByIdAndDelete({_id:userId}) 
//         res.send("User deleted Successfully")
//     }
//     catch(err){
//         res.status(400).send("something went wrong")
//     }
// })

// //update a user
// app.patch("/user/:userId",async(req,res)=>{
//     const data = req.body
//     const userId = req.params?.userId
//     try{
//         const ALLOWED_UPDATES = ["photoUrl","about","gender","skills","age"]
//         const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))
//         const userSkills = req.body.skills
//         if(userSkills.length>5){
//             throw new Error("maximum skills input limit reached")
//         }
//         if(!isUpdateAllowed){
//             throw new Error("Update not allowed")
//         }
//         const users = await User.findByIdAndUpdate({_id:userId},data,{
//             runValidators:true //this will validate if the gender whihc is being passed is valide or not
//         }) // we can also give like this const users = await User.findByIdAndUpdate(userId,data)
//         res.send("user updated successfully")
//     }
//     catch(err){
//         res.status(400).send("Update Failed" + err.message)
//     }
// })


app.use(express.json()) //this middleware will convert all incoming json objects to js object
app.use(cookieParser())

app.post("/signup",async(req,res)=>{
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

app.post("/login",async(req,res)=>{
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


app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user //ye  req.user middleware se aarha h
        console.log("the logged in user is " + user.firstName);
        res.send(user) 
    }catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
    
})

app.post("/sendConnection",userAuth,async(req,res)=>{
    //sending connection request
    const user = req.user
    console.log("sent connection request")
    res.send(user.firstName + " has sent connection request")
})



connectDB()
    .then(()=>{
    console.log("db connection established successfully");
    app.listen(3000,()=>{
    console.log("server started successfully at port 3000");
    
})  
    })
    .catch((err)=>{
        console.error("database cannot be connected!!");
        
    })



//mongodb+srv://NamsteNode:AkUdFOetg83i8PIW@namastenode.wxze5pg.mongodb.net/devTinder