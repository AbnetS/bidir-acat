'use strict';
/**
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:loanProduct-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');


const TokenDal          = require('../dal/token');
const LoanProductDal        = require('../dal/loanProduct');
const LogDal            = require('../dal/log');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Create a loanProduct.
 *
 * @desc create a loanProduct using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createLoanProduct(next) {
  debug('create question loanProduct');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_LOAN_PRODUCT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('name')
      .notEmpty('Loan Product Name is Empty');
  this.checkBody('maximum_loan_amount')
      .notEmpty('Loan Product Maximum Loan Amount is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_LOAN_PRODUCT_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    body.created_by = this.state._user._id;

    let loanProduct = yield LoanProductDal.get({ name: body.name });
    if(loanProduct) {
      throw new Error('LoanProduct with that name already exists!!');
    }

    loanProduct = yield LoanProductDal.create(body);

    this.body = loanProduct;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_LOAN_PRODUCT_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single loanProduct.
 *
 * @desc Fetch a loanProduct with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneLoanProduct(next) {
  debug(`fetch loanProduct: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let loanProduct = yield LoanProductDal.get(query);

    yield LogDal.track({
      event: 'view_loanProduct',
      loanProduct: this.state._user._id ,
      message: `View loanProduct - ${loanProduct.name}`
    });

    this.body = loanProduct;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_LOAN_PRODUCT_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single loanProduct.
 *
 * @desc Fetch a loanProduct with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateLoanProduct(next) {
  debug(`updating loanProduct: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_LOAN_PRODUCT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let loanProduct = yield LoanProductDal.update(query, body);

    yield LogDal.track({
      event: 'loanProduct_update',
      loanProduct: this.state._user._id ,
      message: `Update Info for ${loanProduct.name}`,
      diff: body
    });

    this.body = loanProduct;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_LOAN_PRODUCT_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of loanProducts by Pagination
 *
 * @desc Fetch a collection of loanProducts
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllLoanProducts(next) {
  debug('get a collection of loanProducts by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_LOAN_PRODUCTS_COLLECTION_ERROR',
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
    let loanProducts = yield LoanProductDal.getCollectionByPagination(query, opts);

    this.body = loanProducts;
    
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_LOAN_PRODUCTS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};