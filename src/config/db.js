const mongoose = require("mongoose")

const connectDB = async() =>{
    await mongoose.connect(
        "mongodb+srv://srijanshukla353:_hwV.bJ9QwZZ-YD@cluster0.g2yyu4x.mongodb.net/devTinder"
    )
}
module.exports= connectDB 
