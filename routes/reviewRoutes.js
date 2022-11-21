const express = require('express');
const {
  isAuthenticatedUser,
  authorizdRole,
} = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(
    isAuthenticatedUser,
    authorizdRole('user'),
    setTourUserId,
    createReview
  );

router.route('/:id').delete(deleteReview).patch(updateReview).get(getReview);
module.exports = router;
