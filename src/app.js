const express = require("express")
const User = require("./models/user")
const connectDB=require("./config/db")
const app=express()
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const { userAuth } = require("./middlewares/auth");


app.use(express.json())
app.use(cookieParser())

app.post('/signup',async (req,res)=>{

    const {firstName,lastName,emailId,password} = req.body
    try{
        validateSignUpData(req)
        const passwordHash = await bcrypt.hash(password,10)
        const user = new User({
            firstName,lastName,emailId,password:passwordHash
        })

        
        await user.save()
        res.send("user added successfully")
        }
    catch(err){
        res.status(400).send("Error: "+ err.message)
    }    
    
})

app.post("/login", async(req,res) => {
    try {
        
        const {emailId,password} = req.body
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("invalid credentials")

        }

        const isPasswordValid = await bcrypt.compare(password,user.password) 
        if(isPasswordValid ){

            const token = jwt.sign({ _id: user._id }, "SecretKey")

            res.cookie("token",token)
            
            res.send("Login Successful ")

        }else{
            throw new Error("invalid credentials")
        }


    } catch (error) {
        res.status(400).send("ERROR :"+err.message)
    }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  

  res.send(user.firstName + "sent the connect request!");
});


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
