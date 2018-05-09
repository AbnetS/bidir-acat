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
const Section        = require('../models/ACATSection');
const ClientACAT     = require('../models/clientACAT');

const TokenDal          = require('../dal/token');
const SectionDal        = require('../dal/ACATSection');
const LogDal            = require('../dal/log');
const QuestionDal       = require('../dal/question');
const ACATFormDal           = require('../dal/ACATForm');
const CostListDal       = require('../dal/costList');
const ACATDal          = require('../dal/ACAT');
const CashFlowDal      = require('../dal/cashFlow');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Create a section.
 *
 * @desc create a section using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createSection(next) {
  debug('create question section');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_SECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('title')
      .notEmpty('Section Title is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_SECTION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let form = yield ACATForm.findOne({}).exec();
    if(!form) {
      throw new Error('ACAT Form Does Not Exist')
    }

    let section = yield SectionDal.get({ title: body.title });
    if(section) {
      throw new Error('Section with that title already exists!!');
    }

    let parentSection;
    if(body.parent_section) {
      parentSection = yield Section.findOne({ _id: body.parent_section }).exec();
      if(!parentSection) throw new Error('Parent Section Does Not Exist')
    }

    if(body.has_cost_list) {
      let costList = yield CostListDal.create({});

      body.cost_list = costList._id;
    }

    if(body.title.toLowerCase() == 'seed') {
      let attrs = {
        variety: '',
        seed_source: ''
      };

      _.merge(body, attrs);


    } else if(body.title.toLowerCase() == 'yield') {
      let attrs = {
        estimated: {
          yield: {
            uofm_for_yield: '' ,
            max:            0
          },
          price: {
            uofm_for_price: '',
            max:            0
          }
        },
        achieved: {
          yield: {
            uofm_for_yield: '' ,
            max:            0
          },
          price: {
            uofm_for_price: '',
            max:            0
          }
        },
        marketable_yield: {
          own:          '',
          seed_reserve: '',
          for_market:   ''
        }
      };

      _.merge(body, attrs);
    }

    section = yield SectionDal.create(body);

    if(body.parent_section) {
      parentSection = parentSection.toJSON();

      let sections = parentSection.sub_sections.slice();

      sections.push(section._id);

      yield SectionDal.update({ _id: parentSection._id },{
        sub_sections: sections
      });

    } else {
      form = form.toJSON();

      let sections = form.sections.slice();

      sections.push(section._id);

      yield ACATFormDal.update({ _id: form._id },{
        sections: sections
      });
    }

    this.body = section;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_SECTION_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single section.
 *
 * @desc Fetch a section with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneSection(next) {
  debug(`fetch section: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let section = yield SectionDal.get(query);

    yield LogDal.track({
      event: 'view_section',
      section: this.state._user._id ,
      message: `View section - ${section.title}`
    });

    this.body = section;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_SECTION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single section.
 *
 * @desc Fetch a section with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateSection(next) {
  debug(`updating section: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_SECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let clientACAT;

    if(body.is_client_acat && !body.client_acat) {
      throw new Error('Please provide Client ACAT reference!');
    } else {
      clientACAT = yield ClientACAT.findOne({ _id: body.client_acat}).exec();
      if(!clientACAT) {
        throw new Error('Client ACAT Does Not Exist')
      }
    }

    let section = yield SectionDal.get(query);
    if(!section) {
      throw new Error('Section Does Not Exist')
    }

    if(body.estimated_cash_flow) {
      let ref = body.estimated_cash_flow._id;
      delete body.estimated_cash_flow._id;

      body.estimated_cash_flow.last_updated = moment().toISOString();

      yield CashFlowDal.update({ _id: ref }, body.estimated_cash_flow);

      delete body.estimated_cash_flow
    }

    if(body.achieved_cash_flow) {
      let ref = body.achieved_cash_flow._id;
      delete body.achieved_cash_flow._id;

      body.achieved_cash_flow.last_updated = moment().toISOString();

      yield CashFlowDal.update({ _id: ref }, body.achieved_cash_flow);

      delete body.achieved_cash_flow
    }

    section = yield SectionDal.update(query, body);

    if(body.is_client_acat) {
      for(let acat of clientACAT.ACATs){
        yield computeValues(acat);
      }
    }

    yield LogDal.track({
      event: 'section_update',
      user: this.state._user._id ,
      message: `Update Info for ${section._id}`,
      diff: body
    });

    this.body = section;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_SECTION_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of sections by Pagination
 *
 * @desc Fetch a collection of sections
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllSections(next) {
  debug('get a collection of sections by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_SECTIONS_COLLECTION_ERROR',
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
    let sections = yield SectionDal.getCollectionByPagination(query, opts);

    this.body = sections;
    
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_SECTIONS_COLLECTION_ERROR',
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
    console.log(inputAchievedSubTotal, inputEstimatedSubTotal)

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