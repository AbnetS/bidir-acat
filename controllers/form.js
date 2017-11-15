'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:form-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');

const TokenDal           = require('../dal/token');
const FormDal          = require('../dal/form');
const LogDal             = require('../dal/log');


/**
 * Create a form.
 *
 * @desc create a form using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createForm(next) {
  debug('create form');

  let body = this.request.body;

  this.checkBody('type')
      .notEmpty('Form Type is Empty');
  this.checkBody('title')
      .notEmpty('Form Title is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'FORM_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let form = yield FormDal.get({ title: body.title });
    if(form) {
      throw new Error('Form with that title already exists!!');
    }

    // Create Form Type
    form = yield FormDal.create(body);

    this.body = form;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'FORM_CREATION_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single form.
 *
 * @desc Fetch a form with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneForm(next) {
  debug(`fetch form: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let form = yield FormDal.get(query);

    yield LogDal.track({
      event: 'view_form',
      form: this.state._user._id ,
      message: `View form - ${form.title}`
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FORM_RETRIEVAL_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update Form Status
 *
 * @desc Fetch a form with the given ID and update their respective status.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.updateStatus = function* updateForm(next) {
  debug(`updating status form: ${this.params.id}`);

  this.checkBody('is_active')
      .notEmpty('is_active should not be empty');

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let form = yield FormDal.update(query, body);

    yield LogDal.track({
      event: 'form_status_update',
      form: this.state._user._id ,
      message: `Update Status for ${form.title}`,
      diff: body
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FORM_STATUS_UPDATE_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single form.
 *
 * @desc Fetch a form with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateForm(next) {
  debug(`updating form: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let form = yield FormDal.update(query, body);

    yield LogDal.track({
      event: 'form_update',
      form: this.state._user._id ,
      message: `Update Info for ${form.title}`,
      diff: body
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_FORM_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of forms by Pagination
 *
 * @desc Fetch a collection of forms
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllForms(next) {
  debug('get a collection of forms by pagination');

  // retrieve pagination query params
  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};

  let sortType = this.query.sort_by;
  let sort = {};
  sortType ? (sort[sortType] = 1) : null;

  let opts = {
    page: +page,
    limit: +limit,
    sort: sort
  };

  try {
    let forms = yield FormDal.getCollectionByPagination(query, opts);

    this.body = forms;
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_PAGINATED_FORMS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};