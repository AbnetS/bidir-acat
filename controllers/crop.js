'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug      = require('debug')('api:crop-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');
const googleBuckets      = require('../lib/google-buckets');

const TokenDal          = require('../dal/token');
const CropDal        = require('../dal/crop');
const LogDal            = require('../dal/log');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Create a crop.
 *
 * @desc create a crop using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createCrop(next) {
  debug('create question crop');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_CROP_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;
  let bodyKeys = Object.keys(body);
  let isMultipart = (bodyKeys.indexOf('fields') !== -1) && (bodyKeys.indexOf('files') !== -1);

  // If content is multipart reduce fields and files path
  if(isMultipart) {
    let _clone = {};

    for(let key of bodyKeys) {
      let props = body[key];
      let propsKeys = Object.keys(props);

      for(let prop of propsKeys) {
        _clone[prop] = props[prop];
      }
    }

    this.request.body = _clone;

    body = this.request.body;

  }

  this.checkBody('name')
      .notEmpty('Crop Name is Empty');
  this.checkBody('category')
      .notEmpty('Crop category is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_CROP_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let crop = yield CropDal.get({ name: body.name });
    if(crop) {
      throw new Error('Crop Already Exists');
    }

    if(body.image) {
      let filename  = body.name.trim().toUpperCase().split(/\s+/).join('_');
      let id        = crypto.randomBytes(6).toString('hex');
      let extname   = path.extname(body.image.name);
      let assetName = `${filename}_${id}${extname}`;

      let url       = yield googleBuckets(body.image.path, assetName);

      body.image = url;
    }

    crop = yield CropDal.create(body);

    this.body = crop;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_CROP_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single crop.
 *
 * @desc Fetch a crop with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneCrop(next) {
  debug(`fetch crop: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let crop = yield CropDal.get(query);

    yield LogDal.track({
      event: 'view_crop',
      crop: this.state._user._id ,
      message: `View crop - ${crop.title}`
    });

    this.body = crop;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_CROP_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single crop.
 *
 * @desc Fetch a crop with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateCrop(next) {
  debug(`updating crop: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_CROP_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let crop = yield CropDal.update(query, body);

    yield LogDal.track({
      event: 'crop_update',
      crop: this.state._user._id ,
      message: `Update Info for ${crop.title}`,
      diff: body
    });

    this.body = crop;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_CROP_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of crops by Pagination
 *
 * @desc Fetch a collection of crops
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllCrops(next) {
  debug('get a collection of crops by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_CROPS_COLLECTION_ERROR',
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
    let crops = yield CropDal.getCollectionByPagination(query, opts);

    this.body = crops;
    
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_CROPS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};