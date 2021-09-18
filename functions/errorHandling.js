const { success } = require("./response");


class ErrorHandler extends Error {
    constructor(statusCode, message) {
      let msg = message;
      if(message.includes('duplicate key value violates unique constraint \"unique_mobile_no\"')){
        msg = "This phone number is already registered.";
      }
      super();
      this.statusCode = statusCode;
      this.message = msg;
    }
  }
  const handleError = (err, res) => {
    const { statusCode, message } = err;
  
    var code = statusCode;
    if(code === undefined){
      code =400;
    }
    console.log(code);
    res.status(code).json({
      status: "error",
      statusCode,
      message
    });
  };
  class ResponseHandler {
      constructor(
        statusCode,
         message, 
         result) {
        // super();
        this.statusCode = statusCode;
        this.message = message;
        this.result = result;
      }
    }
    const handleResponse = (data, res) => {
      const {statusCode,
         message,
         result } = data;
      data.status(statusCode).json(
        success(message, { data:result }, 200)
        
      //   { status: "success",
      //   statusCode,
      //   message,
      //   result
       
      // }
      );
    };
  module.exports = {
    ErrorHandler,
    handleError,
    ResponseHandler,
    handleResponse
  }