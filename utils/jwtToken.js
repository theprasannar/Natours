const jwt = require('jsonwebtoken');
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie('token', token, options)
    .send({
      status: 'success',
      token,
      data: {
        user: user,
      },
    });
};

module.exports = sendToken;
