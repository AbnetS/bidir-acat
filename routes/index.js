'use strict';

/**
 * Load Module Dependencies
 */
const Router = require('koa-router');
const debug  = require('debug')('api:app-router');

const rootRouter          = require('./root');
const acatRouter      = require('./acat');
const sectionRouter      = require('./section');
const yieldRouter      = require('./yield');
const costListRouter      = require('./costList');

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
//Add Yields Router
composeRoute('acat/yields', yieldRouter);
//Add Cost List Router
composeRoute('acat/costLists', costListRouter);
//Add Sections Router
composeRoute('acat/sections', sectionRouter);

function composeRoute(endpoint, router){
  appRouter.use(`/${endpoint}`, router.routes(), router.allowedMethods());
}
// Export App Router
module.exports = appRouter;
