const express = require('express');
const { signUp, logIn } = require('../controllers/authController');
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

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
