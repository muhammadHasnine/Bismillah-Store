const ErroHandler = require("../utils/errorhander")
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong MongoDB URL Error
  if(err.name === "CastError"){
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErroHandler(message,400)
  }

  res.status(err.statusCode).json({
    success:false,
    error:err.message
  })
};
