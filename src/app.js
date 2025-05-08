const express = require("express")
const { Long } = require("mongodb")

const app = express()

app.use("/test",(req,res)=>{
    res.send("hello from the server from test url")
})

app.use("/hello",(req,res)=>{
    res.send("hello hello hello");
})

app.use("/",(req,res)=>{
    res.send("hello from the server to the dashboard")
})




app.listen(3000,()=>{
    console.log("server started successfully at port 3000");
    
})