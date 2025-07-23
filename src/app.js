const express = require("express")
const User = require("./models/user")
const connectDB=require("./config/db")
const app=express()

app.use(express.json())

app.post('/signup',async (req,res)=>{

    const user = new User(req.body)
    try{
        await user.save()
        res.send("user added successfully")
        }
    catch(err){
        res.status(400).send("error saving the user: "+ err.message)
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

app.patch("/user",async (req,res)=>{
    const userId = req.body.userId
    const data=req.body
    try{
        await User.findByIdAndUpdate({_id:userId},data)
        res.send("user updated successfully")
    }catch(err){
        res.status(400).send("something went wrong")
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
