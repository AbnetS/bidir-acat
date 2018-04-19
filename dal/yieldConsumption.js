'use strict';
// Access Layer for YieldConsumption Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-yieldConsumption');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const YieldConsumption    = require('../models/yieldConsumption');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = YieldConsumption.attributes;
var population = [];

/**
 * create a new yieldConsumption.
 *
 * @desc  creates a new yieldConsumption and saves them
 *        in the database
 *
 * @param {Object}  yieldConsumptionData  Data for the yieldConsumption to create
 *
 * @return {Promise}
 */
exports.create = function create(yieldConsumptionData) {
  debug('creating a new yieldConsumption');

  return co(function* () {

    let unsavedYieldConsumption = new YieldConsumption(yieldConsumptionData);
    let newYieldConsumption = yield unsavedYieldConsumption.save();
    let yieldConsumption = yield exports.get({ _id: newYieldConsumption._id });

    return yieldConsumption;


  });

};

/**
 * delete a yieldConsumption
 *
 * @desc  delete data of the yieldConsumption with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteYieldConsumption(query) {
  debug('deleting yieldConsumption: ', query);

  return co(function* () {
    let yieldConsumption = yield exports.get(query);
    let _empty = {};

    if(!yieldConsumption) {
      return _empty;
    } else {
      yield yieldConsumption.remove();

      return yieldConsumption;
    }

  });
};

/**
 * update a yieldConsumption
 *
 * @desc  update data of the yieldConsumption with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating yieldConsumption: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return YieldConsumption.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a yieldConsumption.
 *
 * @desc get a yieldConsumption with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, yieldConsumption) {
  debug('getting yieldConsumption ', query);

  return YieldConsumption.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of yieldConsumptions
 *
 * @desc get a collection of yieldConsumptions from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of yieldConsumptions');

  return new Promise((resolve, reject) => {
    resolve(
     YieldConsumption
      .find(query, returnFields)
      .populate(population)
      .stream());
  });


};

/**
 * get a collection of yieldConsumptions using pagination
 *
 * @desc get a collection of yieldConsumptions from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of yieldConsumptions');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    YieldConsumption.paginate(query, opts, function (err, docs) {
      if(err) {
        return reject(err);
      }

      let data = {
        total_pages: docs.pages,
        total_docs_count: docs.total,
        current_page: docs.page,
        docs: docs.docs
      };

      return resolve(data);

    });
  });


};
