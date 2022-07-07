const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: "this is a sample id",
          url: "profileUrl",
        },
      })
      res.status(201).json({
        success:true,
        user
      })
})