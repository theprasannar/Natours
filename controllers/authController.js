const User = require('../models/userModel');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const sendEmail = require('../utils/email');
const sendToken = require('../utils/jwtToken');

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

  sendToken(newUser, 201, res);
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
  sendToken(user, 200, res);
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

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? click the link to reset your password: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(
        'There was an error sending the email. Try again later!'
      ),
      500
    );
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ErrorHandler('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  sendToken(user, 200, res);
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new ErrorHandler('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  sendToken(user, 200, res);
});
