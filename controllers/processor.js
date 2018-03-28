'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');

const debug       = require('debug')('api:form-controller');
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

const Section         = require('../models/ACATSection');
const Form            = require('../models/ACATForm');
const Client          = require('../models/client');
const ClientACAT      = require('../models/clientACAT');

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const SectionDal       = require('../dal/ACATSection');
const CostListDal      = require('../dal/costList');
const ClientACATDal    = require('../dal/clientACAT');
const ACATDal          = require('../dal/ACAT');
const CostListItemDal   = require('../dal/costListItem');
const GroupedListDal    = require('../dal/groupedList');
const LoanProductDal    = require('../dal/loanProduct');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Initialize client acat skeleton.
 *
 * @desc Initialize ACAT Skeleton for a crop
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.initialize = function* initializeClientACAT(next) {
  debug('initialize acat form');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'INITIALIZE_CLIENT_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('client')
      .notEmpty('Client Reference is Empty');
  this.checkBody('loan_product')
      .notEmpty('Loan Product Reference is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'INITIALIZE_CLIENT_ACAT_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  // PREDEFINED SECTIONS

  try {

    let client = yield Client.findOne({ _id: body.client }).exec();
    if(!client) throw new Error('Client Does Not Exist');

    let clientACAT = yield ClientACAT.findOne({ client: client._id }).exec();
    if(clientACAT) throw new Error('Client Has an ACAT Processor Already!!');

    clientACAT = yield ClientACATDal.create({
      client: client._id,
      branch: client.branch,
      created_by: this.state._user.account
    });

    clientACAT = yield ClientACAT.findOne({ client: client._id }).exec();

    // ADD ACAT Items
    if(body.crop_acats && Array.isArray(body.crop_acats)) {
      let acats = [];

      for(let form of body.crop_acats) {
        
        let acat = yield createCropACAT(form, this.state._user, client);

        acats.push(acat._id);
      }

      clientACAT = yield ClientACATDal.update({ _id: clientACAT._id },{
        ACATs: acats
      })
    }


    clientACAT = yield ClientACATDal.update({ _id: clientACAT._id },{
      loan_product: body.loan_product
    });
    
    this.body = clientACAT;

  } catch(ex) {
    console.log(ex);
    this.throw(new CustomError({
      type: 'INITIALIZE_CLIENT_ACAT_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Create a ACAT.
 *
 * @desc create a acat from form 
 * 
 * @param {Function} next Middleware dispatcher
 *
 */
exports.addACAT = function* addACAT(next) {
  debug('add acat');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'ADD_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('client_acat')
      .notEmpty('client ACAT reference is empty');
  this.checkBody('crop_acat')
      .notEmpty('crop ACAT reference is empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'ADD_ACAT_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    let clientACAT = yield ClientACAT.findOne({ _id: body.client_acat }).exec();
    if(!clientACAT) throw new Error('Client ACAT Does Not Exist');

    let acat = yield createCropACAT(body.crop_acat, this.state._user, clientACAT);

    this.body = acat;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'ADD_ACAT_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single form.
 *
 * @desc Fetch a form with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneACATForm(next) {
  debug(`fetch form: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'GET_ACAT_FORM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    client: this.params.id
  };

  try {
    let clientACAT = yield ClientACATDal.get(query);
    if(!clientACAT) throw new Error('Client ACAT doesnt exist!!');

    yield LogDal.track({
      event: 'view_clientACAT',
      user: this.state._user._id ,
      message: `View clientACAT - ${clientACAT.title}`
    });

    this.body = clientACAT;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_CLIENT_ACAT_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single form.
 *
 * @desc Fetch a form with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateACATForm(next) {
  debug(`updating form: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_FORM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }


  let query = {
    _id: this.params.id
  };
  let body = this.request.body;


  if(this.errors) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_FORM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    
    delete body.signatures;
    delete body.type;

    let clientACAT = yield ClientACATDal.update(query, body);
    if(!clientACAT) throw new Error('Client ACAT doesnt exist!!');

    yield LogDal.track({
      event: 'form_update',
      user: this.state._user._id ,
      message: `Update Info for ${form.title}`,
      diff: body
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_FORM_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of forms by Pagination
 *
 * @desc Fetch a collection of forms
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllACATForms(next) {
  debug('get a collection of forms by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_CLIENT_ACAT_COLLECTION_ERROR',
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
    let clientACATs = yield clientACAT.getCollectionByPagination(query, opts);

    this.body = clientACATs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_CLIENT_ACAT_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};



function createSection(section, parent) {
  return co(function*() {
    delete section._id;

    let subs = [];

    let subSections = section.sub_sections.slice();
    delete section.sub_sections;

    if(section.cost_list) {
      let costList    = yield createCostList(section.cost_list);

      section.cost_list = costList._id;
    }

    section = yield SectionDal.create(section);

    for(let sub of subSections) {
      yield createSection(sub, section);
    }

    if(parent) {
      parent = yield Section.findOne({ _id: parent._id }).exec();
      parent = parent.toJSON();

      let sections = parent.sub_sections.slice();
      sections.push(section._id)

      yield SectionDal.update({ _id: parent._id },{
        sub_sections: sections
      })
    }

    return section;
  })
}

function createCostList(costList) {
  return co(function* () {
    delete costList._id;

    let linear = [];
    let grouped = [];

    for(let linearItem of costList.linear) {
      delete linearItem._id;
      
      let item = yield CostListItemDal.create(linearItem);

      linear.push(item._id);
    }

    for(let groupItem of costList.grouped) {
      delete groupItem._id;
      let items = [];

      for(let item of groupItem.items) {
        delete item._id;

        let _item = yield CostListItemDal.create(item);

        items.push(_item._id);
      }

      let group = yield GroupedListDal.create({
        title: groupItem.title,
        items: items
      });

      grouped.push(group._id);
    }

    costList.linear = linear;
    costList.grouped = grouped;

    let list = yield CostListDal.create(costList);

    return list;
  })
}

function createCropACAT(form, user, client) {
  return co(function* () {
    let acatForm = yield FormDal.get({ _id: form });
    if(!acatForm) return null;

    acatForm = acatForm.toJSON();

    let data = {
      type: acatForm.type,
      title: acatForm.title,
      client: client,
      subtitle: acatForm.subtitle,
      purpose: acatForm.purpose,
      layout: acatForm.layout,
      crop: acatForm.crop,
      estimated: acatForm.estimated,
      achieved: acatForm.achieved,
      first_expense_month: acatForm.first_expense_month,
      status: 'new',
      cropping_area_size: acatForm.cropping_area_size,
      access_to_non_financial_resources: acatForm.access_to_non_financial_resources,
      non_financial_resources: acatForm.non_financial_resources,
      created_by: user._id
    };

    let acat = yield ACATDal.create(data);
    let sections = [];

    // TODO: Refactor for a better iterator
    for(let section of acatForm.sections) {
      let sect = yield createSection(section);

      sections.push(sect._id);
    }

    acat = yield ACATDal.update({ _id: acat._id },{
      sections: sections
    });

    console.log(acat)

    return acat;

  })
}