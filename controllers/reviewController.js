const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserId = (req, res, next) => {
  console.log("here");
  if (!req.body.tour) {
    req.body.tour = req.params.tourID;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  next();
};
exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
