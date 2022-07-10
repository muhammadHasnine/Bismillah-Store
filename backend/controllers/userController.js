const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");

//User Registration
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profileUrl",
    },
  });

  sendToken(user,201,res);
});

//User Login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user given email and password both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if(!user){
    return next(new ErrorHandler("Invalid email and password", 401))
  }
  const isPasswordMatched = await user.comparePassword(password)

  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email and password", 401))
  }
  
  sendToken(user,200,res);
  
});

//Log out 
exports.logout = catchAsyncError(async(req,res,next)=>{

  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })
  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
})