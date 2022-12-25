const express = require('express');
const {
  isAuthenticatedUser,
  authorizdRole,
} = require('../controllers/authController');

const reviewRouter = require('./../routes/reviewRoutes');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlans,
  getToursWithin,
  getDistance,
} = require('../controllers/tourControllers');

const router = express.Router();

// router.param('id', checkID);

router.use('/:tourID/reviews', reviewRouter);

router.route('/get-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    isAuthenticatedUser,
    authorizdRole('admin', 'lead-guide'),
    getMonthlyPlans
  );

router.route('/top-5-tours').get(aliasTopTours, getAllTours);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);
//router.route('/tours-within?distance=400&center=-40,40&unit=mi')
//we can also write

router.route('/tours-within/center/:latlng/unit/:unit').get(getDistance);

router
  .route('/')
  .get(getAllTours)
  .post(isAuthenticatedUser, authorizdRole('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(isAuthenticatedUser, authorizdRole('admin', 'lead-guide'), updateTour)
  .delete(
    isAuthenticatedUser,
    authorizdRole('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
