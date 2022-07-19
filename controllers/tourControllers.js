const fs = require('fs');
const mongoose = require('mongoose');
const ApiFeatures = require('../utils/apiFeatures');
const Tour = require('../models/tourModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

//Create alias for most popular route
exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,description,summary,ratingsAverage';
  req.query.limit = 5;
  next();
};

//Create tour controller
exports.createTour = catchAsyncErrors(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

//get all the tours
exports.getAllTours = catchAsyncErrors(async (req, res) => {
  console.log('req.query', req.query);
  const apiFeatures = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .field()
    .pagination();

  let tours = await apiFeatures.query;
  res.status(201).json({
    status: 'success',
    results: tours.length,
    data: {
      tour: tours,
    },
  });
});

//Get a single Tour
exports.getTour = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new ErrorHandler('No Tour found', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

//Update Tour Controller
exports.updateTour = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValudators: true,
  });
  if (!tour) {
    return next(new ErrorHandler('No Tour found', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//Delete tour controller
exports.deleteTour = catchAsyncErrors(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new ErrorHandler('No Tour found', 404));
  }
  res.status(201).json({
    status: 'success',
  });
});

/* 
Get statstics , average price and average rating of tours grouped by the
difficulty level
*/
exports.getTourStats = catchAsyncErrors(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numberOfTours: { $sum: 1 },
        numOfRatings: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(201).json({
    status: 'success',
    stats,
  });
});

//Get the details of most busiest month of the year
//would help in managing resources

exports.getMonthlyPlans = catchAsyncErrors(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    plan,
  });
});
