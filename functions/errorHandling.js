

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
  module.exports = {
    ErrorHandler,
    handleError
  }