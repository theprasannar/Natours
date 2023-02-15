const ErrorHandler = require('../utils/errorhandler');

const sendDevErrors = (err, req, res) => {
  // API
  if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stack: err.stack,
    });
  }else{
    // Rendered website errors
    res.status(err.statusCode).render('error',{
     title: 'Something went wrong!',
     msg: err.message
    });
  }
};

const sendProdErrors = (err, req, res) => {
  if (err.isOperationalError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'internal server error';

  if (process.env.NODE_ENV === 'development') {
    sendDevErrors(err, req ,res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.name === 'CastError') {
      const message = `Invalid ${err.path}: ${err.value}`;
      error = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      const message = `Duplicate field value: ${value}. Please use another value!`;
      error = new ErrorHandler(message, 400);
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((el) => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      error = new ErrorHandler(message, 400);
    }
    if (error.name === 'JsonWenTokenError') {
      const message = 'json web token is invalid';
      error = new ErrorHandler(message, 400);
    }
    if (error.name === 'TokenExpiredError') {
      const message = 'json web token is expired';
      error = new ErrorHandler(message, 400);
    }

    sendProdErrors(error, res);
  }
};
