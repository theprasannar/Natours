const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await Review.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsyncErrors(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  // SEND RESPONSE
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
