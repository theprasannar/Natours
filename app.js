const express = require('express');
const fs = require('fs');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error');
const app = express();
const ErrorHandler = require('./utils/ErrorHandler');
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new ErrorHandler('Page Not Found', 404));
});

app.use(errorMiddleware);

module.exports = app;
