const express = require('express');
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

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
