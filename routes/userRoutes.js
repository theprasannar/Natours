const express = require('express');
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  isAuthenticatedUser,
} = require('../controllers/authController');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userControllers');

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(logIn);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

//this will run for all the router below
router.use(isAuthenticatedUser);

router.route('/updatePassword').patch(updatePassword);

router.route('/updateMe').patch(updateMe);
router.route('/deleteMe').delete(deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/me').get(getMe, getUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
