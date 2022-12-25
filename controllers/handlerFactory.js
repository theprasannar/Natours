const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new ErrorHandler('No Document found with the ID', 404));
    }
    res.status(201).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValudators: true,
    });
    if (!document) {
      return next(new ErrorHandler('No Document found', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsyncErrors(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const document = await query;
    if (!document) {
      return next(new ErrorHandler('No Document found', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    //to allow for nested get Reviews
    let filter = {};
    if (req.params.tourID) filter = { tour: req.params.tourID };

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .field()
      .pagination();

    let document = await apiFeatures.query;
    res.status(201).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });
