'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug       = require('debug')('api:acat-controller');
const moment      = require('moment');
const jsonStream  = require('streaming-json-stringify');
const _           = require('lodash');
const co          = require('co');
const del         = require('del');
const validator   = require('validator');

const config              = require('../config');
const CustomError         = require('../lib/custom-error');
const checkPermissions    = require('../lib/permissions');
const FORM                = require ('../lib/enums').FORM;

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const SectionDal       = require('../dal/ACATSection');
const CostListDal      = require('../dal/costList');
const ClientACATDal    = require('../dal/clientACAT');
const ACATDal          = require('../dal/ACAT');

let hasPermission = checkPermissions.isPermitted('ACAT');


/**
 * Get a single acat.
 *
 * @desc Fetch a acat with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneACAT(next) {
  debug(`fetch acat: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'GET_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };

  try {
    let ACAT = yield ACATDal.get(query);
    if(!ACAT) throw new Error('ACAT Does Not Exist');

    yield LogDal.track({
      event: 'view_ACAT',
      user: this.state._user._id ,
      message: `View ACAT - ${ACAT.title}`
    });

    this.body = ACAT;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_ACAT_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single ACAT.
 *
 * @desc Fetch a ACAT with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateACAT(next) {
  debug(`updating ACAT: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }


  let query = {
    _id: this.params.id
  };

  let body = this.request.body;


  if(this.errors) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let ACAT = yield ACATDal.update(query, body);
    if(!ACAT) throw new Error('ACAT Does Not Exist');

    yield LogDal.track({
      event: 'acat_update',
      user: this.state._user._id ,
      message: `Update Info for ${acat.title}`,
      diff: body
    });

    this.body = ACAT;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of ACATs by Pagination
 *
 * @desc Fetch a collection of acats
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllACATs(next) {
  debug('get a collection of ACATs by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_COLLECTION_ERROR',
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
    let ACATs = yield ACATDal.getCollectionByPagination(query, opts);

    this.body = ACATs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_ACAT_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Remove a single acat.
 *
 * @desc Fetch a acat with the given id from the database
 *       and Remove their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeACAT(next) {
  debug(`removing screening: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let acat = yield ACATDal.delete(query);
    if(!acat._id) {
      throw new Error('ACATForm Does Not Exist!');
    }

    for(let section of acat.sections) {
      section = yield SectionDal.delete({ _id: section._id });
      if(section.sub_section.length) {
        for(let _section of section.sub_sections) {
          yield SectionDal.delete({ _id: _section._id });
        }
      }
    }

    yield LogDal.track({
      event: 'acat_delete',
      permission: this.state._user._id ,
      message: `Delete Info for ${acat._id}`
    });

    this.body = acat;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_ACAT_FORM_ERROR',
      message: ex.message
    }));

  }

};

// Utilities