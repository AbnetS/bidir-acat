'use strict';
// Access Layer for LoanProduct Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-form');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const LoanProduct          = require('../models/loanProduct');

const mongoUpdate   = require('../lib/mongo-update');

var returnFields = LoanProduct.attributes;
var population = [];

/**
 * create a new form.
 *
 * @desc  creates a new form and saves them
 *        in the database
 *
 * @param {Object}  formData  Data for the form to create
 *
 * @return {Promise}
 */
exports.create = function create(formData) {
  debug('creating a new form');

  return co(function* () {

    let unsavedLoanProduct = new LoanProduct(formData);
    let newLoanProduct = yield unsavedLoanProduct.save();
    let form = yield exports.get({ _id: newLoanProduct._id });

    return form;


  });

};

/**
 * delete a form
 *
 * @desc  delete data of the form with the given
 *        id
 *
 * @param {Object}  query   Query Object
 *
 * @return {Promise}
 */
exports.delete = function deleteLoanProduct(query) {
  debug('deleting form: ', query);

  return co(function* () {
    let form = yield exports.get(query);
    let _empty = {};

    if(!form) {
      return _empty;
    } else {
      yield form.remove();

      return form;
    }

  });
};

/**
 * update a form
 *
 * @desc  update data of the form with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 *
 * @return {Promise}
 */
exports.update = function update(query, updates) {
  debug('updating form: ', query);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  return LoanProduct.findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();
};

/**
 * get a form.
 *
 * @desc get a form with the given id from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.get = function get(query, form) {
  debug('getting form ', query);

  return LoanProduct.findOne(query, returnFields)
    .populate(population)
    .exec();

};

/**
 * get a collection of forms
 *
 * @desc get a collection of forms from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of forms');

  return new Promise((resolve, reject) => {
    resolve(
     LoanProduct
      .find(query, returnFields)
      .populate(population)
      .stream());
  });


};

/**
 * get a collection of forms using pagination
 *
 * @desc get a collection of forms from db
 *
 * @param {Object} query Query Object
 *
 * @return {Promise}
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of forms');

  let opts = {
    select:  returnFields,
    sort:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };


  return new Promise((resolve, reject) => {
    LoanProduct.paginate(query, opts, function (err, docs) {
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
