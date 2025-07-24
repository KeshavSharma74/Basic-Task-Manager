import express from "express";
import "dotenv/config"
import connectDb from "./config/database.js";
const app=express()

connectDb();
const port=process.env.PORT||5000

app.get('/',(req,res)=>{
    res.send("App is live")
})

app.listen(port,()=>{
    console.log("App is listening at port : ",port)
})

