const express = require('express');

// Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();
const ErrorHandler = require('./utils/ErrorHandler');

// 1) MIDDLEWARES

//set Security Headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Rate limit middleware
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests, please try again later.',
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new ErrorHandler('Page Not Found', 404));
});

app.use(errorMiddleware);

module.exports = app;
