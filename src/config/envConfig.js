const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');
const fs = require('fs');

const envPath = path.join(__dirname, '../../.env');

if (fs.existsSync(envPath) || process.env.DOTENV !== 'FALSE') {
  dotenv.config({ envPath });
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    SITE_URL: Joi.string(),
    SITE_NAME: Joi.string().default('Cafechan'),
    STORAGE_CLIENT: Joi.string()
      .valid('LOCAL', 'FILESTACK')
      .default('LOCAL')
      .description('the client for uploading files from post'),
    STORAGE_CLIENT_API_KEY: Joi.string().description('the client API key if is using a third-party client'),
    MONGODB_URL: Joi.string()
      .required()
      .description('Mongo DB url'),
    JWT_SECRET: Joi.string()
      .required()
      .description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    CIPHER_SECRET: Joi.string()
      .length(32)
      .required(),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  },
  site_name: envVars.SITE_NAME,
  site_url: envVars.SITE_URL,
  storage_client: envVars.STORAGE_CLIENT,
  storage_client_api_key: envVars.STORAGE_CLIENT_API_KEY,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  cipher_secret: envVars.CIPHER_SECRET,
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
