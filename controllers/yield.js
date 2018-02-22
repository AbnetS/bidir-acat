'use strict';
/**
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:_yield-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');

const ACATForm              = require('../models/ACATForm');

const TokenDal          = require('../dal/token');
const YieldDal        = require('../dal/yield');
const LogDal            = require('../dal/log');
const QuestionDal       = require('../dal/question');
const ACATFormDal           = require('../dal/ACATForm');
const CostListDal       = require('../dal/costList');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Create a _yield.
 *
 * @desc create a _yield using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createYield(next) {
  debug('create question _yield');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_YIELD_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('has_cost_list')
      .notEmpty('Indicate whether _yield has cost list or not ie true or false');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_YIELD_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let form = yield ACATForm.findOne({}).exec();
    if(!form) {
      throw new Error('ACAT Form Does Not Exist')
    }

    let _yield = yield YieldDal.get({ type: 'YIELD' });
    if(_yield) {
      throw new Error('Yield  already exists!!');
    }

    if(body.has_cost_list) {
      let costList = yield CostListDal.create({});

      body.costlist = costlist._id;
    }

    // Create Yield Type
    _yield = yield YieldDal.create(body);

    form = form.toJSON();

    let _yields = form._yields.slice();

    _yields.push(_yield._id);

    yield ACATFormDal.update({ _id: form._id },{
        _yields: _yields
      });

    this.body = _yield;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_YIELD_YIELD_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single _yield.
 *
 * @desc Fetch a _yield with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneYield(next) {
  debug(`fetch _yield: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let _yield = yield YieldDal.get(query);

    yield LogDal.track({
      event: 'view__yield',
      _yield: this.state._user._id ,
      message: `View _yield - ${_yield.title}`
    });

    this.body = _yield;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_YIELD_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single _yield.
 *
 * @desc Fetch a _yield with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateYield(next) {
  debug(`updating _yield: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_YIELD_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let _yield = yield YieldDal.update(query, body);

    yield LogDal.track({
      event: '_yield_update',
      _yield: this.state._user._id ,
      message: `Update Info for ${_yield.title}`,
      diff: body
    });

    this.body = _yield;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_YIELD_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of _yields by Pagination
 *
 * @desc Fetch a collection of _yields
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllYields(next) {
  debug('get a collection of _yields by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_YIELDS_COLLECTION_ERROR',
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
    let _yields = yield YieldDal.getCollectionByPagination(query, opts);

    this.body = _yields;
    
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_YIELDS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};