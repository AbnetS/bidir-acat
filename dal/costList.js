'use strict';
// Access Layer for CostList Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-costList');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const CostList    = require('../models/costList');
const CostListItem   = require('../models/costListItem');
const GroupedList    = require('../models/groupedList');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = CostList.attributes;
var population = [{
  path: 'linear',
  select: CostListItem.attributes,
  options: {
    sort: { number: '1' }
  },
},{
  path: 'grouped',
  select: GroupedList.attributes,
  populate: {
    path: 'items',
    select: CostListItem.attributes,
    options: {
      sort: { number: '1' }
    },
  }
}];

/**
 * create a new costList.
 *
 * @desc  creates a new costList and saves them
 *        in the database
 *
 * @param {Object}  costListData  Data for the costList to create
 *
 * @return {Promise}
 */
exports.create = function create(costListData) {
  debug('creating a new costList');

  return co(function* () {

    let unsavedCostList = new CostList(costListData);
    let newCostList = yield unsavedCostList.save();
    let costList = yield exports.get({ _id: newCostList._id });

    return costList;


  });

};

/**
 * delete a costList
 *
 * @desc  delete data of the costList with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteCostList(query) {
  debug('deleting costList: ', query);

  return co(function* () {
    let costList = yield exports.get(query);
    let _empty = {};

    if(!costList) {
      return _empty;
    } else {
      yield costList.remove();

      return costList;
    }

  });
};

/**
 * update a costList
 *
 * @desc  update data of the costList with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating costList: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return CostList.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a costList.
 *
 * @desc get a costList with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, costList) {
  debug('getting costList ', query);

  return CostList.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of costLists
 *
 * @desc get a collection of costLists from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of costLists');

  return new Promise((resolve, reject) => {
    resolve(
     CostList
      .find(query, returnFields)
      .populate(population)
      .stream());
  });


};

/**
 * get a collection of costLists using pagination
 *
 * @desc get a collection of costLists from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of costLists');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    CostList.paginate(query, opts, function (err, docs) {
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
