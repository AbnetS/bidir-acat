'use strict';
// Access Layer for GroupedList Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-groupedList');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const GroupedList    = require('../models/groupedList');
const mongoUpdate   = require('../lib/mongo-update');

var returnFields = GroupedList.attributes;
var population = [];

/**
 * create a new groupedList.
 *
 * @desc  creates a new groupedList and saves them
 *        in the database
 *
 * @param {Object}  groupedListData  Data for the groupedList to create
 *
 * @return {Promise}
 */
exports.create = function create(groupedListData) {
  debug('creating a new groupedList');

  return co(function* () {

    let unsavedGroupedList = new GroupedList(groupedListData);
    let newGroupedList = yield unsavedGroupedList.save();
    let groupedList = yield exports.get({ _id: newGroupedList._id });

    return groupedList;


  });

};

/**
 * delete a groupedList
 *
 * @desc  delete data of the groupedList with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteGroupedList(query) {
  debug('deleting groupedList: ', query);

  return co(function* () {
    let groupedList = yield exports.get(query);
    let _empty = {};

    if(!groupedList) {
      return _empty;
    } else {
      yield groupedList.remove();

      return groupedList;
    }

  });
};

/**
 * update a groupedList
 *
 * @desc  update data of the groupedList with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating groupedList: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return GroupedList.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a groupedList.
 *
 * @desc get a groupedList with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, groupedList) {
  debug('getting groupedList ', query);

  return GroupedList.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of groupedLists
 *
 * @desc get a collection of groupedLists from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of groupedLists');

  return new Promise((resolve, reject) => {
    resolve(
     GroupedList
      .find(query, returnFields)
      .populate(population)
      .stream());
  });


};

/**
 * get a collection of groupedLists using pagination
 *
 * @desc get a collection of groupedLists from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of groupedLists');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    GroupedList.paginate(query, opts, function (err, docs) {
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
