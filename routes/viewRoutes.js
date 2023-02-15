const express = require('express');
const { isLoggedIn, isAuthenticatedUser } = require('../controllers/authController');
const { getOverview, getTour, getLoginForm } = require('../controllers/viewsController');

const router = express.Router();

router.use(isLoggedIn)
router.route('/').get(getOverview);
router.route('/tour/:slug').get(getTour);
router.route('/login').get(getLoginForm)

module.exports = router;
