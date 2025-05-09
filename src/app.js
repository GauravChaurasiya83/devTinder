const express = require("express")
const { Long } = require("mongodb")

const app = express()

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

app.use("/user",(req,res,next)=>{
    console.log("Handling the route user!");
    next()
},
(req,res,next)=>{
    console.log("Handling the route user 2!");
    next()
},
(req,res,next)=>{
    console.log("Handling the route user 3!");
    res.send("3rd response")
}
)

app.listen(3000,()=>{
    console.log("server started successfully at port 3000");
    
})