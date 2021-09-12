

class ErrorHandler extends Error {
    constructor(statusCode, message) {
      let msg = message;
      // if(str.includes('duplicate key value violates unique constraint \"unique_mobile_no\"')){
      //   msg = "This phone number is already registered.";
      // }
      super();
      this.statusCode = statusCode;
      this.message = msg;
    }
  }
  const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message
    });
  };
  class ResponseHandler {
      constructor(
        statusCode,
        //  message, 
         result) {
        // let msg = message;
        // if(str.includes('duplicate key value violates unique constraint \"unique_mobile_no\"')){
        //   msg = "This phone number is already registered.";
        // }
        super();
        this.statusCode = statusCode;
        // this.message = msg;
        this.result = result;
      }
    }
    const handleResponse = (data, res) => {
      const {statusCode,
        //  message,
         result } = data;
      res.status(statusCode).json({
        status: "error",
        statusCode,
        result
      });
    };
  module.exports = {
    ErrorHandler,
    handleError,
    ResponseHandler,
    handleResponse
  }