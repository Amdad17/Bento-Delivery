import dotenv from 'dotenv';
dotenv.config();

const config = {
  DB_PASS: process.env.DB_PASS,
  DB_USER: process.env.DB_USER,

  PORT: process.env.PORT ?? 5000,
  SOCKET_PORT: process.env.SOCKET_PORT ?? 8080,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
  JWT_SECRET: process.env.JWT_SECRET ?? 'secret',

  MARKETPLACE_BE_BASE_URL: process.env.MARKETPLACE_BE_BASE_URL ?? 'http://localhost:4040',
  MARKETPLACE_FE_BASE_URL: process.env.MARKETPLACE_FE_BASE_URL ?? 'http://localhost:4041',

  SKELETON_BE_BASE_URL: process.env.SKELETON_BE_BASE_URL ?? 'http://localhost:4000',
  SKELETON_FE_BASE_URL: process.env.SKELETON_FE_BASE_URL ?? 'http://localhost:4061',
};

export default config;
