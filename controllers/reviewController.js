const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
  let filter = {};
  if (req.params.tourID) filter = { tour: req.params.tourID };
  const reviews = await Review.find(filter);

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
  if (!req.body.tour) {
    req.body.tour = req.params.tourID;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  const newReview = await Review.create(req.body);

  // SEND RESPONSE
  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
