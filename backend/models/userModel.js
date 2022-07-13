const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxlength: [30, "Name cannot excced 30 characters"],
    minlength: [4, "Name should have more than 4 characters"],
  },
  email:{
    type:String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate:[validator.isEmail,"Please Enter a valid Email"]
  },
  password:{
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [8, "Password should be greater then 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//Hashing Password before Save .

userSchema.pre("save",async function(next){
  // when user only change other staff with out password then this will be called.
    if(!this.isModified("password")){ 
        next()
    }
  // if user change password then this code block will be called.
    this.password = await bcrypt.hash(this.password,10);
})

//Generate jwt token
userSchema.methods.getJWTToken = function (){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{ expiresIn:process.env.JWT_EXPIRE })
}

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
  
}

//Generate Token for Reset Password and add to userSchema
userSchema.methods.getresetPasswordToken = function(){
      
      //Generate Token
      const resetToken = crypto.randomBytes(20).toString("hex");

      //Hashing Token and add to schema
      this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      this.resetPasswordExpire = new Date() + 15 * 60 * 1000;

      return resetToken;
}


module.exports = mongoose.model("User",userSchema)