const express = require("express")
const User = require("./models/user")
const connectDB=require("./config/db")
const app=express()
const {validateSignUpData} = require("./utils/validation")

app.use(express.json())

app.post('/signup',async (req,res)=>{

    const user = new User(req.body)
    try{
        validateSignUpData(req)
        await user.save()
        res.send("user added successfully")
        }
    catch(err){
        res.status(400).send("Error: "+ err.message)
    }    
    
})

app.get("/user",async (req,res)=>{

    const userEmail=req.body.emailId
    try{
        const user = await User.find({emailId:userEmail})
        if(user.length === 0){
            res.status(400).send("user not found")
        }
        else{
            res.send(user)
        }
        
    } catch(err){
        res.status(400).send("something went wrong")
    }
})

app.get("/feed",async (req,res)=>{

    try{
        const users = await User.find({})
        res.send(users)
    }catch(err){
        res.status(400).send("somethin went wrong")
    }

})

app.delete("/user",async (req,res)=>{
    const userId = req.body.userID
    try{
        await User.findByIdAndDelete(userId)
        res.send("user deleted successfully")

    }catch(err){
        res.status(400).send("something went wrong")
    }
})

app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId
    const data=req.body
    try{
        const ALLOWED_UPDATES=["about","skills","gender","photoUrl"]
        const isUpdateAllowed= Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        await User.findByIdAndUpdate({_id:userId},data,{runValidators:true})
        res.send("user updated successfully")
    }catch(err){
        res.status(400).send("update failed"+err.message)
    }
})



connectDB()
.then(()=>{
    console.log("db connected")
    app.listen(3000,()=>{console.log("server listening on port 3000")})
})
.catch(err=>{
console.error("db not connected")
})
