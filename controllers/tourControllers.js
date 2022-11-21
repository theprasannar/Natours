const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const factory = require('./handlerFactory');

//Create alias for most popular route
exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,description,summary,ratingsAverage';
  req.query.limit = 5;
  next();
};

//get all the tours
exports.getAllTours = factory.getAll(Tour);

//Get a single Tour
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

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
