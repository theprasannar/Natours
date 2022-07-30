const User = require('../models/userModel');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
exports.signUp = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword, passwordChangedAt } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    passwordChangedAt,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  res.status(200).send({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.logIn = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please Enter email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  res.status(200).send({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
});

//Authentication middlewares
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //get Authorization key from the header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorHandler('Please Login to access this page', 401));
  }
  //Will give error if either the token is invalid or it is expired
  const decodedData = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  let currentUser = await User.findById(decodedData.id);
  if (!currentUser) {
    return next(
      new ErrorHandler(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  let flag = currentUser.changedPasswordAfter(decodedData.iat);
  console.log('flag', flag);
  if (flag) {
    return next(
      new ErrorHandler(
        'User recently changed password! Please log in again.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.authorizdRole = (...roles) => {
  return (req, res, next) => {
    //roles is an array. it is available because of closure
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          'You do not have the authorization to access this page',
          403
        )
      );
    }
    next();
  };
};
