'use strict';

/**
 * Load Module Dependencies
 */
const Router = require('koa-router');
const debug  = require('debug')('api:app-router');

const rootRouter          = require('./root');
const acatRouter          = require('./acat');
const sectionRouter       = require('./section');
const costListRouter      = require('./costList');
const cropRouter          = require('./crop');
const loanProductRouter   = require('./loanProduct');
const clientRouter        = require('./client');
const formRouter          = require('./form');

var appRouter = new Router();

const OPEN_ENDPOINTS = [
    /\/assets\/.*/,
    '/'
];

// Open Endpoints/Requires Authentication
appRouter.OPEN_ENDPOINTS = OPEN_ENDPOINTS;

// Add Root Router
composeRoute('', rootRouter);
//Add ACAT Router
composeRoute('acat', acatRouter);
//Add Cost List Router
composeRoute('acat/costLists', costListRouter);
//Add Sections Router
composeRoute('acat/sections', sectionRouter);
//Add Crops Router
composeRoute('acat/crops', cropRouter);
//Add clients Router
composeRoute('acat/clients', clientRouter);
//Add ACAT forms Router
composeRoute('acat/forms', formRouter);
//Add Loan Products Router
composeRoute('acat/loan-products', loanProductRouter);

function composeRoute(endpoint, router){
  appRouter.use(`/${endpoint}`, router.routes(), router.allowedMethods());
}
// Export App Router
module.exports = appRouter;
