import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import crypto from 'crypto';
import validator from 'validator';
import randomstring from 'randomstring';
import _ from 'lodash';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    index: {
      unique: true,
    },
    required: true,
  },
  email: {
    type: String,
    index: {
      unique: true,
    },
    required: true,
  },
  emailcode: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: Number,
  },
  birthdate: {
    type: Date,
  },
  roles: { // everyone is a user, admin would have both the admin and the user role
    type: Array, default: ['user']
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  image: {
    type: String,
  },
  thumb: {
    type: String,
  },
}, {
  collection: 'db_users',
  timestamps: true
});

// UserSchema.index({ username: 1 });
// UserSchema.index({ email: 1 });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
/*
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) { // eslint-disable-line
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.hashPassword(password);
}).get(function() { // eslint-disable-line
  return this._password;
});


/**
 * Methods
 */
UserSchema.methods = {
  /*
   * HasRole - check if the user has required role
   */
  hasRole: function(role) { // eslint-disable-line
    return this.roles.indexOf('admin') !== -1 || this.roles.indexOf(role) !== -1;
  },

  /*
   * IsAdmin - check if the user is an administrator
   *
   * @return {Boolean}
   * @api public
   */

  isAdmin: function() { // eslint-disable-line
    return this.roles.indexOf('admin') !== -1;
  },

  isRootAdmin: function() { // eslint-disable-line
    return this.roles.indexOf('root') !== -1 && this.roles.indexOf('admin') !== -1;
  },


  /*
   * Authenticate - check if the passwords are the same
   */
  authenticate: function(plainText) { // eslint-disable-line
    return this.hashPassword(plainText) === this.hashed_password;
  },

  isVerified: function() { // eslint-disable-line
    return this.verified;
  },

  /*
   * Make salt
   */
  makeSalt: function() { // eslint-disable-line
    return crypto.randomBytes(16).toString('base64');
  },

  /*
   * Hash password
   */
  hashPassword: function(password) { // eslint-disable-line
    if (!password || !this.salt) return '';
    const salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  verify(userId) {
    if (!userId) {
      return Promise.reject('text-error-user-id');
    }

    return this.update({ _id: userId }, { verified: true }).exec();
  },

  __createProfile(user) {
    if (!user) {
      return Promise.reject('text-error-user-profile-incorrect');
    }
    if (!validator.isEmail(user.email)) {
      return Promise.reject('text-error-email-format-incorrect');
    }
    if (!user.name) {
      return Promise.reject('text-error-name');
    }
    if (!validator.isLength(user.password, 5, 40)) {
      return Promise.reject('text-error-password');
    }
    user.salt = (user.gender && 1) || 2;
    user.gender = (user.gender && 1) || 2;
    user.emailcode = randomstring.generate(36);

    return this.create(user);
  },

  insert(info) {
    info = _.omit(info, '_id', 'hashed_password', 'emailcode', 'salt', 'roles');
    let user;

    if (!info) {
      return Promise.reject(new Error('text-error-info'));
    }
    if (!info.email) {
      return Promise.reject(new Error('text-error-email'));
    }
    if (!info.username) {
      return Promise.reject(new Error('text-error-username'));
    }

    return this.__createProfile(info)
    .then((d) => {
      user = JSON.parse(JSON.stringify(d));
    })
    .then(() => {
      // return this.__sendEmailsalt(user)
    })
    .then(() => {
      // if (process.env.NODE_ENV === 'production') {
      //   return this.setAvatarUrl(this.user._id.toString(), null)
      // }
    })
    .then(() => _.omit(user, 'hashed_password', 'emailcode', 'salt'));
  },
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
