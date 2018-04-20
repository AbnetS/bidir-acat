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


  try {

    if(!body.parent_grouped_list && !body.parent_cost_list) {
      throw new Error('Provide Reference for parent_grouped_list or parent_cost_list');
    }

    let groupedList;
    if(body.parent_grouped_list) {
      groupedList = yield GroupedList.findOne({ _id: body.parent_grouped_list }).exec();
      if(!groupedList) {
        throw new Error('Grouped List Does Not Exist')
      } else {
        groupedList = groupedList.toJSON();

        let groupItems = groupedList.items.slice();
        let isDuplicate = false;

        for(let groupItem of groupItems) {
          let gItem = yield CostListItemDal.get({ _id: groupItem });

          if(gItem.item.toLowerCase() == body.item.toLowerCase()) isDuplicate = true;
        }

        if(isDuplicate) {
          throw new Error('Grouped List Has A Duplicate Item');
        }
      }
    }

    let costList;
    if(body.parent_cost_list) {
      costList = yield CostList.findOne({ _id: body.parent_cost_list }).exec();
      if(!costList) {
        throw new Error('Cost List Does Not Exist')
      }
    }

    body.type = body.type ? body.type.toLowerCase() : 'none';

    let item;
    if(body.type == 'linear') {
      costList = costList.toJSON();

      let linearItems = costList.linear.slice();
      let isDuplicate = false;

      for(let linear of linearItems) {
        let lItem = yield CostListItemDal.get({ _id: linear });

        if(lItem.item.toLowerCase() == body.item.toLowerCase()) isDuplicate = true;
      }

      if(isDuplicate) {
        throw new Error('Linear List Has A Duplicate Item');
      }

      item = yield CostListItemDal.create(body);

    } else if(body.type == 'grouped') {
      // Create Section Type
      item  = yield GroupedListDal.create(body);

    } else {
      item = yield CostListItemDal.create(body);
    }

    if(body.parent_cost_list) {
      
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
 * Get a single item.
 *
 * @desc Fetch a section with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOne(next) {
  debug(`get item: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let costList = yield CostListDal.update(query);
    if(!costList) throw new Error('Cost Does Not Exist')

    this.body = costList;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_COST_LIST_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update grouped List.
 *
 * @desc Fetch a section with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.updateGroupedList = function* updateGroupedList(next) {
  debug(`updating item: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  let body = this.request.body;

  try {
    let groupedList = yield GroupedListDal.update(query, body);
    if(!groupedList || !groupedList._id) throw new Error('Grouped List Does Not Exist')

    this.body = groupedList;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_GROUPED_LIST_ERROR',
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

/**
 * Reset cost list
 *
 * @desc Fetch a cost list with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.reset = function* resetList(next) {
  debug(`Reset item: ${this.params.id}`);

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
  let body = {
    linear: [],
    grouped: []
  }

  try {
    let costList = yield CostListDal.get(query);
    if(!costList) throw new Error('Cost List Does Not Exist!!')

    // remove linear items
    for(let linear of costList.linear) {
      yield CostListItemDal.delete({ _id: linear._id });
    }

    // remove grouped items
    for(let grouped of costList.grouped) {
      for(let item of grouped.items) {
        yield CostListItemDal.delete({ _id: item._id });
      }

      yield GroupedListDal.delete({ _id: grouped._id });

    }

    costList = yield CostListDal.update(query, body);

    yield LogDal.track({
      event: 'list_update',
      section: this.state._user._id ,
      message: `Update Info for ${costList._id}`,
      diff: body
    });

    this.body = costList;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'RESET_COST_LIST_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Remove Linear item.
 *
 * @desc Remove Linear Item for costlist
 *
 * @param {Function} next Middleware dispatcher
 */
exports.removeLinear = function* removeLinear(next) {
  debug(`removing item: ${this.params.id}`);


  let query = {
    _id: this.params.id
  };

  let body = this.request.body;

  this.checkBody('item_id')
      .notEmpty('Cost List Item Reference is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'REMOVE_ITEM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let item;
    let costList = yield CostList.findOne(query).exec();
    if(!costList) throw new Error('Cost List Item Does Not Exist');

    item = yield CostListItemDal.delete({ _id: body.item_id });
    if(!item || !item._id) throw new Error('Cost List Item Does Not Exist');

    let linearItems = costList.linear.slice();

    _.remove(linearItems, item._id);

    yield CostListDal.update({ _id: costList._id },{ linear: linearItems });

    this.body = item;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_ITEM_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Remove Grouped item.
 *
 * @desc Remove Linear Item for costlist
 *
 * @param {Function} next Middleware dispatcher
 */
exports.removeGroupedItem = function* removeGroupedItem(next) {
  debug(`removing item: ${this.params.id}`);


  let query = {
    _id: this.params.id
  };

  let body = this.request.body;

  this.checkBody('item_id')
      .notEmpty('Cost List Item Reference is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'REMOVE_ITEM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let item;

    let groupedList = yield GroupedList.findOne(query).exec();
    if(!groupedList) throw new Error('Grouped Item Does Not Exist');

    item = yield CostListItemDal.delete({ _id: body.item_id });
    if(!item || !item._id) throw new Error('Cost List Item Does Not Exist');

    let items = groupedList.items.slice();

    _.remove(items, item._id);

    yield GroupedListDal.update({ _id: groupedList._id },{ items: items });

    this.body = item;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_ITEM_ERROR',
      message: ex.message
    }));

  }

};


/**
 * Remove Grouped item.
 *
 * @desc Remove Grouped Item for costlist
 *
 * @param {Function} next Middleware dispatcher
 */
exports.removeGrouped = function* removeGrouped(next) {
  debug(`removing item: ${this.params.id}`);


  let query = {
    _id: this.params.id
  };

  let body = this.request.body;

  this.checkBody('item_id')
      .notEmpty('Cost List Item Reference is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'REMOVE_ITEM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let item;
    let costList = yield CostList.findOne(query).exec();
    if(!costList) throw new Error('Cost List Item Does Not Exist');

    item = yield GroupedListDal.delete({ _id: body.item_id });
    if(!item || !item._id) throw new Error('Cost List Item Does Not Exist');

    for(let obj of item.items) {
      yield CostListItemDal.delete({ _id: obj._id });
    }

    let groupedItems = costList.grouped.slice();

    _.remove(groupedItems, item._id);

    yield CostListDal.update({ _id: costList._id },{ grouped: groupedItems });

    this.body = item;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_ITEM_ERROR',
      message: ex.message
    }));

  }

};