const express = require('express');
const {
  isAuthenticatedUser,
  authorizdRole,
} = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(isAuthenticatedUser, authorizdRole('user'), createReview);

module.exports = router;
