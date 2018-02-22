'use strict';
// Access Layer for CostListItem Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-costListItem');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const CostListItem    = require('../models/costListItem');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = CostListItem.attributes;
var population = [];

/**
 * create a new costListItem.
 *
 * @desc  creates a new costListItem and saves them
 *        in the database
 *
 * @param {Object}  costListItemData  Data for the costListItem to create
 *
 * @return {Promise}
 */
exports.create = function create(costListItemData) {
  debug('creating a new costListItem');

  return co(function* () {

    let unsavedCostListItem = new CostListItem(costListItemData);
    let newCostListItem = yield unsavedCostListItem.save();
    let costListItem = yield exports.get({ _id: newCostListItem._id });

    return costListItem;


  });

};

/**
 * delete a costListItem
 *
 * @desc  delete data of the costListItem with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteCostListItem(query) {
  debug('deleting costListItem: ', query);

  return co(function* () {
    let costListItem = yield exports.get(query);
    let _empty = {};

    if(!costListItem) {
      return _empty;
    } else {
      yield costListItem.remove();

      return costListItem;
    }

  });
};

/**
 * update a costListItem
 *
 * @desc  update data of the costListItem with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating costListItem: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return CostListItem.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a costListItem.
 *
 * @desc get a costListItem with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, costListItem) {
  debug('getting costListItem ', query);

  return CostListItem.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of costListItems
 *
 * @desc get a collection of costListItems from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of costListItems');

  return new Promise((resolve, reject) => {
    resolve(
     CostListItem
      .find(query, returnFields)
      .populate(population)
      .stream());
  });


};

/**
 * get a collection of costListItems using pagination
 *
 * @desc get a collection of costListItems from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of costListItems');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    CostListItem.paginate(query, opts, function (err, docs) {
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
