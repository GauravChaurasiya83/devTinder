const express = require("express")
const app = express()
const { connectDB } = require('./config/database')


const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")


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
//             runValidators:true //this will validate if the gender which is being passed is valide or not
//         }) // we can also give like this const users = await User.findByIdAndUpdate(userId,data)
//         res.send("user updated successfully")
//     }
//     catch(err){
//         res.status(400).send("Update Failed" + err.message)
//     }
// })


app.use(express.json()) //this middleware will convert all incoming json objects to js object
app.use(cookieParser())


const authRouter = require("./routers/auth")
const profileRouter = require("./routers/profile")
const requestRouter = require("./routers/request")


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)



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