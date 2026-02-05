class appError extends Error {
  constructor(message = "something went Wrong", statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = appError;
