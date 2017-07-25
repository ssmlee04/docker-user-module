import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('production'),
      then: Joi.boolean().default(false),
      otherwise: Joi.boolean().default(true),
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  FACEBOOK_CLIENT_ID: Joi.string().required(),
  FACEBOOK_CLIENT_SECRET: Joi.string().required(),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27017),
  MONGO_IF_REPLICA: Joi.boolean()
    .default(false),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  facebook: {
    clientID: envVars.FACEBOOK_CLIENT_ID,
    clientSecret: envVars.FACEBOOK_CLIENT_SECRET,
  },
  mongo: {
    host: envVars.NODE_ENV === 'test' ? envVars.MONGO_HOST.replace('-dev', '-test') : envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    ifOptions: envVars.MONGO_IF_REPLICA,
  },
};

export default config;
