'use strict';
/**
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:yieldConsumption-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');

const YieldConsumption      = require('../models/yieldConsumption');

const YieldConsumptionDal   = require('../dal/yieldConsumption');
const LogDal                = require('../dal/log');


let hasPermission = checkPermissions.isPermitted('ACAT');


/**
 * Get a single yieldConsumption.
 *
 * @desc Fetch a yieldConsumption with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneYieldConsumption(next) {
  debug(`fetch yield Consumption: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let yieldConsumption = yield YieldConsumptionDal.get(query);
    if(!yieldConsumption) throw new Error('Yield Consumption Does Not Exist!')

    yield LogDal.track({
      event: 'view_yieldConsumption',
      user: this.state._user._id ,
      message: `View yieldConsumption - ${yieldConsumption._id}`
    });

    this.body = yieldConsumption;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_YIELD_CONSUMPTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single yieldConsumption.
 *
 * @desc Fetch a yieldConsumption with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateYieldConsumption(next) {
  debug(`updating user: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_YIELD_CONSUMPTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let yieldConsumption = yield YieldConsumptionDal.update(query, body);

    yield LogDal.track({
      event: 'yieldConsumption_update',
      user: this.state._user._id ,
      message: `Update Info for ${yieldConsumption._id}`,
      diff: body
    });

    this.body = yieldConsumption;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_YIELD_CONSUMPTION_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of yieldConsumptions by Pagination
 *
 * @desc Fetch a collection of yieldConsumptions
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllYieldConsumptions(next) {
  debug('get a collection of yieldConsumptions by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_YIELD_CONSUMPTIONS_COLLECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  // retrieve pagination query params
  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};

  let sortType = this.query.sort_by;
  let sort = {};
  sortType ? (sort[sortType] = -1) : (sort.date_created = -1 );

  let opts = {
    page: +page,
    limit: +limit,
    sort: sort
  };

  try {
    let yieldConsumptions = yield YieldConsumptionDal.getCollectionByPagination(query, opts);

    this.body = yieldConsumptions;
    
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_YIELD_CONSUMPTIONS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};