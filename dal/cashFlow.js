'use strict';
// Access Layer for CashFlow Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-cashFlow');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const CashFlow    = require('../models/cashFlow');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = CashFlow.attributes;
var population = [];

/**
 * create a new cashFlow.
 *
 * @desc  creates a new cashFlow and saves them
 *        in the database
 *
 * @param {Object}  cashFlowData  Data for the cashFlow to create
 *
 * @return {Promise}
 */
exports.create = function create(cashFlowData) {
  debug('creating a new cashFlow');

  return co(function* () {

    let unsavedCashFlow = new CashFlow(cashFlowData);
    let newCashFlow = yield unsavedCashFlow.save();
    let cashFlow = yield exports.get({ _id: newCashFlow._id });

    return cashFlow;


  });

};

/**
 * delete a cashFlow
 *
 * @desc  delete data of the cashFlow with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteCashFlow(query) {
  debug('deleting cashFlow: ', query);

  return co(function* () {
    let cashFlow = yield exports.get(query);
    let _empty = {};

    if(!cashFlow) {
      return _empty;
    } else {
      yield cashFlow.remove();

      return cashFlow;
    }

  });
};

/**
 * update a cashFlow
 *
 * @desc  update data of the cashFlow with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating cashFlow: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return CashFlow.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a cashFlow.
 *
 * @desc get a cashFlow with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, cashFlow) {
  debug('getting cashFlow ', query);

  return CashFlow.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of cashFlows
 *
 * @desc get a collection of cashFlows from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of cashFlows');

  return new Promise((resolve, reject) => {
    resolve(
     CashFlow
      .find(query, returnFields)
      .populate(population)
      .stream());
  });


};

/**
 * get a collection of cashFlows using pagination
 *
 * @desc get a collection of cashFlows from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of cashFlows');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    CashFlow.paginate(query, opts, function (err, docs) {
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
