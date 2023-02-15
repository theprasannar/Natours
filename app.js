const express = require('express');

// Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const morgan = require('morgan');
const path = require('path');
const errorMiddleware = require('./middlewares/error');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const ErrorHandler = require('./utils/ErrorHandler');
const cookieParser = require('cookie-parser')
var cors = require('cors')
const app = express();

app.use(cors())

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES

app.use(express.static(path.join(__dirname, 'public')));

//set Security Headers
app.use(helmet({
contentSecurityPolicy: false,
}));

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
app.use(cookieParser())

// 2) ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new ErrorHandler('Page Not Found', 404));
});

app.use(errorMiddleware);

module.exports = app;
