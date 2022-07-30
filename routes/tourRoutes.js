const express = require('express');
const {
  isAuthenticatedUser,
  authorizdRole,
} = require('../controllers/authController');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlans,
} = require('../controllers/tourControllers');

const router = express.Router();

// router.param('id', checkID);

router.route('/get-stats').get(getTourStats);

router.route('/monthly-plan/:id').get(getMonthlyPlans);

router.route('/top-5-tours').get(aliasTopTours, getAllTours);

router.route('/').get(isAuthenticatedUser, getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(
    isAuthenticatedUser,
    authorizdRole('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
