'use strict';
// Access Layer for Yield Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-_yield');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Yield    = require('../models/yield');
const CostList    = require('../models/costList');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = Yield.attributes;
var population = [{
  path: 'cost_list',
  select: CostList.attributes
}];

/**
 * create a new _yield.
 *
 * @desc  creates a new _yield and saves them
 *        in the database
 *
 * @param {Object}  _yieldData  Data for the _yield to create
 *
 * @return {Promise}
 */
exports.create = function create(_yieldData) {
  debug('creating a new _yield');

  return co(function* () {

    let unsavedYield = new Yield(_yieldData);
    let newYield = yield unsavedYield.save();
    let _yield = yield exports.get({ _id: newYield._id });

    return _yield;


  });

};

/**
 * delete a _yield
 *
 * @desc  delete data of the _yield with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteYield(query) {
  debug('deleting _yield: ', query);

  return co(function* () {
    let _yield = yield exports.get(query);
    let _empty = {};

    if(!_yield) {
      return _empty;
    } else {
      yield _yield.remove();

      return _yield;
    }

  });
};

/**
 * update a _yield
 *
 * @desc  update data of the _yield with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating _yield: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return Yield.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a _yield.
 *
 * @desc get a _yield with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, _yield) {
  debug('getting _yield ', query);

  return Yield.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of _yields
 *
 * @desc get a collection of _yields from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of _yields');

  return new Promise((resolve, reject) => {
    resolve(
     Yield
      .find(query, returnFields)
      .populate(population)
      .stream());
  });


};

/**
 * get a collection of _yields using pagination
 *
 * @desc get a collection of _yields from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of _yields');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    Yield.paginate(query, opts, function (err, docs) {
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
