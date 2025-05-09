const express = require("express")

const app = express()

const { adminAuth, userAuth } = require('./middlewares/auth')

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

app.use("/admin",adminAuth)
app.use("/user",userAuth)

app.get("/user",(req,res)=>{
    //logic for sending data from db
    res.send("user data sent")
})

app.get("/admin/getAllUsers",(req,res)=>{
    //logic for sending data from db
    res.send("all data sent")
})
app.get("/admin/deleteUser",(req,res)=>{
    //logic for deleting data from db
    res.send("deleted user")
})

app.listen(3000,()=>{
    console.log("server started successfully at port 3000");
    
})