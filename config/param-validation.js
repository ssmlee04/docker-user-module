import Joi from 'joi';

export default {
  createUser: {
    body: {
      email: Joi.string().email().required(),
      username: Joi.string(),
      name: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/),
    }
  },

  updateUser: {
    body: {
      username: Joi.string(),
      name: Joi.string(),
    },
    // params: {
    //   userId: Joi.string().hex().required()
    // }
  },

  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
