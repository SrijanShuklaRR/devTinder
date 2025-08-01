const mongoose= require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
        trim:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        /*
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id"+value)
            }
        },
        */
    },
    password:{
        type:String,
        /*
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password"+value)
            }
        }
        */    
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        },
    },
    photoUrl:{
        type:String,
        default:"https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url"+value)
            }
        },
    },
    skills:{
        type:[String],
        maxeLength:[10,"A user can have at most 10 skills"]
    },
    about:{
        type:String,
        default:"This is default about user"
    }
},
{
    timestamps:true
})

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "SecretKey", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports=mongoose.model("User",userSchema)