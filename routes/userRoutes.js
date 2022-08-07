const express = require('express');
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(logIn);

router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
