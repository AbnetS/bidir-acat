'use strict';

/**
 * Load Module dependencies.
 */
const path = require('path');

const env = process.env;

const PORT        = env.PORT || 8120;
const API_URL     = env.API_URL || 'http://127.0.0.1:8120';
const NODE_ENV    = env.NODE_ENV || 'development';
const HOST        = env.HOST_IP || 'localhost';

const MONTHS      = [
  {name: 'jan', label: 'Jan', full_name: "January", index: 0},
  {name: 'feb', label: 'Feb', full_name: "February", index: 1},
  {name: 'mar', label: 'Mar', full_name: "March", index: 2},
  {name: 'apr', label: 'Apr', full_name: "April", index: 3},
  {name: 'may', label: 'May', full_name: "May", index: 4},
  {name: 'june', label: 'June', full_name: "June", index: 5},
  {name: 'july', label: 'July', full_name: "July", index: 6},
  {name: 'aug', label: 'Aug', full_name: "August", index: 7},
  {name: 'sep', label: 'Sep', full_name: "September", index: 8},
  {name: 'oct', label: 'Oct', full_name: "October", index: 9},
  {name: 'nov', label: 'Nov', full_name: "November", index: 10},
  {name: 'dec', label: 'Dec', full_name: "December", index: 11}
]

const MONGODB_URL = env.MONGODB_URL || 'mongodb://127.0.0.1:27017/bidir';

let config = {

  // Root Configs
  API_URL: API_URL,

  ENV: NODE_ENV,

  PORT: PORT,

  HOST: HOST,


  MONGODB: {
    URL: MONGODB_URL,
    OPTS: {
      server:{
        auto_reconnect:true
      }
    }
  },

  CORS_OPTS: {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization'    
  },

  SALT_FACTOR: 12,

  TOKEN: {
    RANDOM_BYTE_LENGTH: 32
  },


  ASSETS: {
    FILE_SIZE: 2 * 1024 * 1024, // 1MB,
    URL: API_URL + '/media/',
    DIR: path.resolve(process.cwd(), './assets') + '/',
    PROD: 'http://api.bidir.gebeya.co/assets/',
    DEV: 'http://api.dev.bidir.gebeya.co/assets/'
  },

  GOOGLE_BUCKETS: {
    ACCESS_ID: 'bidir-bucket-access@los-bidir.iam.gserviceaccount.com',
    KEY: path.join(__dirname, '../config/google-buckets.pem')
  },

  S2: {
    URL: "http://35.195.254.222/CommonSense/S2/wps"
  },

  MONTHS: MONTHS
};

module.exports = config;
