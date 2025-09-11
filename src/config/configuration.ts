import * as dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export default () => ({
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT),

  databaseURL:
    process.env.NODE_ENV === 'development'
      ? process.env.DATABASE_URL
      : process.env.DATABASE_URL,

  environment: process.env.NODE_ENV || 'development',

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  //   jwtAlgorithm: process.env.JWT_ALGORITHM,
  //   jwtExpiresIn: process.env.JWT_EXPIRES_IN

  /**
   * API configs
   */
  api: {
    prefix: '/api/v1',
  },
});
