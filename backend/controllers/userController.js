const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail")
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

//Forgot Password
exports.forgotUserPassword = catchAsyncError(async(req,res,next)=>{

  const user = await User.findOne({email:req.body.email})
  if(!user){
    return next(new ErrorHandler("User not found",404))
  } 
  //Get Reset Token
  const resetToken =  user.getresetPasswordToken()

  await user.save({validateBeforeSave: false})

  //Create Reset Url and add to Message
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

  const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignor it`

  try {

    await sendMail({
      email:user.email,
      subject:"Bismillah Store Password Recovery",
      message,
    })
    res.status(200).json({
      success:true,
      message:`Email sent to ${user.email} successfully`
    })
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave: false})
    return next(new ErrorHandler(error.message,500))
  }

})