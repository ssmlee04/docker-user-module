import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/login-facebook-token -  */
// router.route('/login-facebook-token')
  // .post(validate(paramValidation.login), authCtrl.loginFacebookToken);

/** GET /api/auth/loggedin - Return the user if loggedin */
router.route('/loggedin')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.loggedin);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

// app.route('/api/v1/users/me')
//     .put(users.edit)

// app.route('/api/v1/users/editpassword')
//     .put(users.editpassword)

//   app.route('/api/v1/auth/logout')
//     .get(users.signout)

//   app.route('/api/v1/auth/register')
//     .post(users.create)

//   app.route('/api/v1/auth/forgot-password')
//     .post(users.forgotpassword)

//   app.route('/api/v1/auth/reset/:token')
//     .post(users.resetpassword)

//   app.route('/api/v1/auth/resendconfirmation')
//     .post(users.resendConfirmation)

//   app.route('/api/v1/auth/verifyemail/:emailsalt(*)')
//     .get(users.verifyEmail)

export default router;
