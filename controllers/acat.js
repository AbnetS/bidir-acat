'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug       = require('debug')('api:acat-controller');
const moment      = require('moment');
const jsonStream  = require('streaming-json-stringify');
const _           = require('lodash');
const co          = require('co');
const del         = require('del');
const validator   = require('validator');

const config              = require('../config');
const CustomError         = require('../lib/custom-error');
const checkPermissions    = require('../lib/permissions');
const FORM                = require ('../lib/enums').FORM;

const ACATForm       = require('../models/ACATForm');
const Section        = require('../models/ACATSection');
const ClientACAT     = require('../models/clientACAT');

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const SectionDal       = require('../dal/ACATSection');
const CostListDal      = require('../dal/costList');
const ClientACATDal    = require('../dal/clientACAT');
const ACATDal          = require('../dal/ACAT');

let hasPermission = checkPermissions.isPermitted('ACAT');


/**
 * Get a single acat.
 *
 * @desc Fetch a acat with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneACAT(next) {
  debug(`fetch acat: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };

  try {
    let ACAT = yield ACATDal.get(query);
    if(!ACAT) throw new Error('ACAT Does Not Exist');

    yield LogDal.track({
      event: 'view_ACAT',
      user: this.state._user._id ,
      message: `View ACAT - ${ACAT.title}`
    });

    this.body = ACAT;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single ACAT.
 *
 * @desc Fetch a ACAT with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateACAT(next) {
  debug(`updating ACAT: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }


  let query = {
    _id: this.params.id
  };

  let canApprove = yield hasPermission(this.state._user, 'AUTHORIZE');

  this.checkBody('status')
      .notEmpty('Status should not be empty')
      .isIn(['submitted', 'approved', 'declined_for_review'], 'Correct Status is either approved, submitted or declined_for_review');
  this.checkBody('is_client_acat')
      .notEmpty('Client ACAT Checker is empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    if(body.status === 'approved' || body.status === 'declined_for_review' ) {
      if(!canApprove) {
        throw new Error("You Don't have enough permissions to complete this action");
      }
    }

    let clientACAT;

    if(body.is_client_acat && !body.client_acat) {
      throw new Error('Please provide Client ACAT reference!');
    } else {
      clientACAT = yield ClientACAT.findOne({ _id: body.client_acat}).exec();
      if(!clientACAT) {
        throw new Error('Client ACAT Does Not Exist')
      }
    }

    let ACAT = yield ACATDal.update(query, body);
    if(!ACAT) throw new Error('ACAT Does Not Exist');

    if(body.status === 'approved') {
      client = yield ClientDal.update({ _id: screening.client }, { status: 'ACAT_approval_in_progress' });
      let task = yield TaskDal.update({ entity_ref: ACAT._id }, { status: 'completed', comment: comment });
      if(task) {
        yield NotificationDal.create({
          for: task.created_by,
          message: `Crop ACAT of ${client.first_name} ${client.last_name} has been approved`,
          task_ref: task._id
        });
      }

    } else if(body.status === 'declined_final') {
      client = yield ClientDal.update({ _id: screening.client }, { status: 'ineligible' });
      let task = yield TaskDal.update({ entity_ref: ACAT._id }, { status: 'completed', comment: comment });
      if(task) {
        yield NotificationDal.create({
          for: task.created_by,
          message: `Crop ACAT of ${client.first_name} ${client.last_name} has been declined in Final`,
          task_ref: task._id
        }); 
      }
      

    } else if(body.status === 'declined_under_review') {
      client = yield ClientDal.update({ _id: screening.client }, { status: 'screening_inprogress' });
      let task = yield TaskDal.update({ entity_ref: screening._id }, { status: 'completed', comment: comment });
      if(task) {
        // Create Review Task
        let _task = yield TaskDal.create({
          task: `Review Screening Application of ${client.first_name} ${client.last_name}`,
          task_type: 'review',
          entity_ref: screening._id,
          entity_type: 'screening',
          created_by: this.state._user._id,
          user: task.created_by,
          branch: screening.branch,
          comment: comment
        });
        yield NotificationDal.create({
          for: this.state._user._id,
          message: `Screening Application of ${client.first_name} ${client.last_name} has been declined For Further Review`,
          task_ref: _task._id
        });
      }
      

    } else if(body.status === 'submitted') {
      client = yield ClientDal.update({ _id: screening.client }, { status: 'screening_inprogress' });
    }
    
    let mandatory = false;

    if(body.questions) {
      let questions = [];

      for(let question of body.questions) {
        let questionID = question._id;

        delete question._id;
        delete question._v;
        delete question.date_created;
        delete question.last_modified;

        let result = yield QuestionDal.update({ _id: questionID }, question);

        questions.push(result);
      }

      body.questions = questions;
    }


    if(body.is_client_acat) {
      for(let acat of clientACAT.ACATs){
        yield computeValues(acat);
      }
    }

    yield LogDal.track({
      event: 'acat_update',
      user: this.state._user._id ,
      message: `Update Info for ${acat.title}`,
      diff: body
    });

    this.body = ACAT;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of ACATs by Pagination
 *
 * @desc Fetch a collection of acats
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllACATs(next) {
  debug('get a collection of ACATs by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_COLLECTION_ERROR',
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
    let ACATs = yield ACATDal.getCollectionByPagination(query, opts);

    this.body = ACATs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_ACAT_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Remove a single acat.
 *
 * @desc Fetch a acat with the given id from the database
 *       and Remove their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeACAT(next) {
  debug(`removing screening: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let acat = yield ACATDal.delete(query);
    if(!acat._id) {
      throw new Error('ACATForm Does Not Exist!');
    }

    for(let section of acat.sections) {
      section = yield SectionDal.delete({ _id: section._id });
      if(section.sub_section.length) {
        for(let _section of section.sub_sections) {
          yield SectionDal.delete({ _id: _section._id });
        }
      }
    }

    yield LogDal.track({
      event: 'acat_delete',
      permission: this.state._user._id ,
      message: `Delete Info for ${acat._id}`
    });

    this.body = acat;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_ACAT_FORM_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a client  ACATs
 *
 * @desc Fetch a collection of acats for a given client
 *
 * @param {Function} next Middleware dispatcher
 */
exports.getClientACATs = function* getClientACATs(next) {
  debug('get a collection of ACATs for a client');

  let query = {
    client: this.params.id
  };


  try {
    let ACATs = yield ACATDal.getCollection(query);

    this.body = ACATs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_CLIENT_ACATS_ERROR',
      message: ex.message
    }));
  }
};

// Utilities

function computeValues(acat) {
  return co(function* () {
    let inputEstimatedSubTotal = 0;
    let inputAchievedSubTotal = 0;
    let iac = null;

    acat = yield ACATDal.get({ _id: acat });

    // compute input totals
    for(let section of acat.sections) {
      section = yield SectionDal.get({ _id: section._id });

      if(section.title == 'Inputs And Activity Costs') {
        iac = section._id;
        for(let sub of section.sub_sections) {
          switch(sub.title) {
              case 'Labour Cost':
                inputAchievedSubTotal += sub.achieved_sub_total;
                inputEstimatedSubTotal += sub.estimated_sub_total;
                
              break;
              case 'Other Costs':
                inputAchievedSubTotal += sub.achieved_sub_total;
                inputEstimatedSubTotal += sub.estimated_sub_total;
                

              break;
              case 'Input':
                let achievedSubtotal = 0;
                let estimatedSubtotal = 0;

                for(let ssub of sub.sub_sections) {
                  console.log(ssub.title, ssub.estimated_sub_total)
                  achievedSubtotal += ssub.achieved_sub_total;
                  estimatedSubtotal += ssub.estimated_sub_total;
                }

                inputAchievedSubTotal += achievedSubtotal;
                inputEstimatedSubTotal += estimatedSubtotal;
                
              break;
            }
        }
      } // IAC

      if(section.title == 'Revenue') {
        for(let _sub of section.sub_sections) {
          _sub = yield SectionDal.get({ _id: _sub._id });
          for(let sub of _sub.sub_sections) {
             if(sub.title == 'Probable Yield') {
              inputAchievedSubTotal += sub.achieved_sub_total;
             }

             inputEstimatedSubTotal += sub.estimated_sub_total;
             
          }
        }
      }

    }

    yield SectionDal.update({ _id: iac },{
      achieved_sub_total: inputAchievedSubTotal,
      estimated_sub_total: inputEstimatedSubTotal
    })

  });
}