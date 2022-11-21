const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

//DO NOT ATTEMPT TO CHANGE PASSWORD WITH THIS
exports.updateUser = factory.updateOne(User);

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.deleteUser = factory.deleteOne(User);
