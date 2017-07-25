// @flow

import jwt from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import APIError from '../helpers/APIError';
import _ from 'lodash';
import config from '../../config/config';
import passport from './../passport';

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  passport.authenticate('user', {}, (err, user, message) => {
    if (err) {
      return res.json(500, { error: err.toString() });
    }
    if (message && message.msg) {
      return res.json(401, { error: message.msg });
    }
    const payload = _.omit(JSON.parse(JSON.stringify(user)), 'hashed_password', 'salt', 'emailcode');
    const token = jwt.sign({
      _id: user._id,
      roles: user.roles,
    }, config.jwtSecret);

    return res.send({
      token,
      user: payload,
    });
  })(req, res, next);
}

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function loggedin(req, res) {
  return res.json({
    user: req.user,
  });
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100,
  });
}

export default { login, loggedin, getRandomNumber };
