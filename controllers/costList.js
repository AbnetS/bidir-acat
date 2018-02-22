'use strict';
/**
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:section-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');

const ACATForm       = require('../models/ACATForm');
const CostList       = require('../models/costList');
const GroupedList    = require('../models/groupedList');

const TokenDal          = require('../dal/token');
const SectionDal        = require('../dal/ACATSection');
const LogDal            = require('../dal/log');
const QuestionDal       = require('../dal/question');
const ACATFormDal       = require('../dal/ACATForm');
const CostListDal       = require('../dal/costList');
const CostListItemDal   = require('../dal/costListItem');
const GroupedListDal    = require('../dal/groupedList');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Create  item.
 *
 * @desc 
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.addItem = function* addtem(next) {
  debug('Add Item to Cost List');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'ADD_COST_LIST_ITEM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('type')
      .notEmpty('Cost List Item type is either linear or grouped');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'ADD_COST_LIST_ITEM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    if(!body.parent_grouped_list && !body.parent_cost_list) {
      throw new Error('Provide Reference for parent_grouped_list or parent_cost_list');
    }

    let groupedList;
    if(body.parent_grouped_list) {
      groupedList = yield GroupedList.findOne({ _id: body.parent_grouped_list }).exec();
      if(!groupedList) {
        throw new Error('Grouped List Does Not Exist')
      }
    }

    let costList;
    if(body.parent_cost_list) {
      costList = yield CostList.findOne({ _id: body.parent_cost_list }).exec();
      if(!costList) {
        throw new Error('Cost List Does Not Exist')
      }
    }

    body.type = body.type.toLowerCase();

    let item;
    if(body.type == 'linear') {
      item = yield CostListItemDal.create({});

    } else if(body.type == 'grouped') {
      // Create Section Type
      item  = yield GroupedListDal.create({
        title: body.title
      });

    }

    if(body.parent_cost_list) {
      costList = costList.toJSON();

      if(body.type == 'linear') {
        let linear = costList.linear.slice();

        linear.push(item._id);

        yield CostListDal.update({ _id: costList._id },{
          linear: linear
        });
      } else {
        let grouped = costList.grouped.slice();

        grouped.push(item._id);

        yield CostListDal.update({ _id: costList._id },{
          grouped: grouped
        });
      }

    } else if(body.parent_grouped_list) {
      groupedList = groupedList.toJSON();

      let items = groupedList.items.slice();

      items.push(item._id);

      yield GroupedListDal.update({ _id: groupedList._id },{
        items: items
      });
    }

    this.body = item;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'ADD_COST_LIST_ITEM_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single item.
 *
 * @desc Fetch a section with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateItem(next) {
  debug(`updating item: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_COST_LIST_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let costListItem = yield CostListItemDal.update(query, body);

    yield LogDal.track({
      event: 'section_update',
      section: this.state._user._id ,
      message: `Update Info for ${costListItem._id}`,
      diff: body
    });

    this.body = costListItem;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_COST_LIST_ERROR',
      message: ex.message
    }));

  }

};