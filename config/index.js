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

const MONTHS      = {
  January:      {name: 'jan', label: 'Jan', index: 0},
  February:     {name: 'feb', label: 'Feb', index: 1},
  March:        {name: 'mar', label: 'Mar', index: 2},
  April:        {name: 'apr', label: 'Apr', index: 3},
  May:          {name: 'may', label: 'May', index: 4},
  June:         {name: 'june', label: 'June', index: 5},
  July:         {name: 'july', label: 'July', index: 6},
  August:       {name: 'aug', label: 'Aug', index: 7},
  September:    {name: 'sep', label: 'Sep', index: 8},
  October:      {name: 'oct', label: 'Oct', index: 9},
  November:     {name: 'nov', label: 'Nov', index: 10},
  December:     {name: 'dec', label: 'Dec', index: 11}

}

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
    DIR: path.resolve(process.cwd(), './assets') + '/'
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
