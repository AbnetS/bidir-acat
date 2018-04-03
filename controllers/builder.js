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

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const CropDal        = require('../dal/crop');
const SectionDal      = require('../dal/ACATSection');
const CostListDal       = require('../dal/costList');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Initialize acat skeleton.
 *
 * @desc Initialize ACAT Skeleton for a crop
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.initialize = function* initializeACATForm(next) {
  debug('initialize acat form');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'INITIALIZE_ACAT_FORM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('title')
      .notEmpty('ACATForm Title is Empty');
  this.checkBody('crop')
      .notEmpty('ACATForm Crop Value is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'INITIALIZE_FORM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  // PREDEFINED SECTIONS

  try {

    body.type = 'ACAT';

    let form = yield FormDal.get({ crop: body.crop });
    if(form) {
      console.log(form);
      throw new Error('ACAT For Crop already exists!!');
    }

    body.created_by = this.state._user._id;


    // Create ACATForm Type
    form = yield FormDal.create(body);

    for(let section of FORM.ACAT_STRUCTURE) {
      form = yield Form.findOne({ _id: form._id }).exec();
      form = form.toJSON();

      if(section.name == 'Inputs And Activity Costs') {
        form = yield createIAC(form);

      } else if(section.name == 'Yield') {
        form = yield createYield(form);

      }
    }

    yield CropDal.update({ _id: body.crop }, { has_acat: true });

    this.body = form;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'INITIALIZE_ACAT_FORM_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Create a form.
 *
 * @desc create a form using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createACATForm(next) {
  debug('create form');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_ACAT_FORM_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('title')
      .notEmpty('ACATForm Title is Empty');
  this.checkBody('crop')
      .notEmpty('ACATForm Crop Value is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_FORM_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    body.type = 'ACAT';

    let form = yield FormDal.get({ crop: body.crop });
    if(form) {
      throw new Error('ACAT Form already exists!!');
    }

    body.created_by = this.state._user._id;

    // Create ACATForm Type
    form = yield FormDal.create(body);

    this.body = form;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_ACAT_FORM_ERROR',
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
    _id: this.params.id
  };

  try {
    let form = yield FormDal.get(query);
    if(!form) throw new Error('Form Does Not Exist')

    yield LogDal.track({
      event: 'view_form',
      user: this.state._user._id ,
      message: `View form - ${form.title}`
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_ACAT_FORM_ERROR',
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

    let form = yield FormDal.update(query, body);
    if(!form) throw new Error('Form Does Not Exist')

    yield LogDal.track({
      event: 'form_update',
      form: this.state._user._id ,
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
      type: 'VIEW_ACAT_FORMS_COLLECTION_ERROR',
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
    let forms = yield FormDal.getCollectionByPagination(query, opts);

    this.body = forms;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_ACAT_FORMS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Remove a single form.
 *
 * @desc Fetch a form with the given id from the database
 *       and Remove their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeACATForm(next) {
  debug(`removing screening: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let form = yield FormDal.delete(query);
    if(!form._id) {
      throw new Error('ACATForm Does Not Exist!');
    }

    for(let section of form.sections) {
      section = yield SectionDal.delete({ _id: section._id });
      if(section.sub_section.length) {
        for(let _section of section.sub_sections) {
          yield SectionDal.delete({ _id: _section._id });
        }
      }
    }

    yield LogDal.track({
      event: 'form_delete',
      permission: this.state._user._id ,
      message: `Delete Info for ${form._id}`
    });

    this.body = form;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_ACAT_FORM_ERROR',
      message: ex.message
    }));

  }

};

// Utilities
function createIAC(form) {
  return co(function* () {
    // create Main Section
    let mainSection = yield SectionDal.create({
      title:'Inputs And Activity Costs',
      number: 1
    });

    // Add Main Section to Form
    let formSections = form.sections.slice();
    formSections.push(mainSection._id)
    form = yield FormDal.update({ _id: form._id },{
      sections: formSections
    });


    // Create Sub Sections
    let subSections = ['Input', 'Labour Cost', 'Other Costs'];
    let _sections = [];
    

    for(let sub of subSections) {
      let costList;
      let sect;

      switch(sub) {
        case 'Labour Cost':
          costList = yield CostListDal.create({});

          sect = yield SectionDal.create({
            number: 2,
            cost_list: costList._id,
            title:'Labour Cost'
          });

          _sections.push(sect._id);

        break;
        case 'Other Costs':
          costList = yield CostListDal.create({});

          sect = yield SectionDal.create({
            number: 3,
            cost_list: costList._id,
            title: 'Other Costs'
          });

          _sections.push(sect._id);

        break;
        case 'Input':
          let subs = []

          // create Seed Section
          costList = yield CostListDal.create({});
          let seedSection = yield SectionDal.create({
            variety: '',
            seed_source: ['ESE', 'Union', 'Private'],
            title: 'Seed',
            number: 1,
            cost_list: costList._id
          });
          subs.push(seedSection._id)

          // create Fertilizers Section
          costList = yield CostListDal.create({});
          let fertilizersSection = yield SectionDal.create({
            title: 'Fertilizers',
            number: 2,
            cost_list: costList._id
          })
          subs.push(fertilizersSection._id)

          // create Chemicals Section
          costList = yield CostListDal.create({});
          let chemicalsSection = yield SectionDal.create({
            title: 'Chemicals',
            number: 3,
            cost_list: costList._id
          });
          subs.push(chemicalsSection._id);

          sect = yield SectionDal.create({
            number: 1,
            title: 'Input',
            sub_sections: subs
          });

          _sections.push(sect._id);
        break;
      }
    }

    yield SectionDal.update({ _id: mainSection._id },{
      sub_sections: _sections.slice()
    });

    return form;
  });
}

function createYield(form) {
  return co(function* () {
    // create Main Section
    let mainSection = yield SectionDal.create({
      title:'Yield',
      number: 2,
      estimated_max_revenue: 0,
      estimated_min_revenue: 0,
      estimated: {
        yield: {
          uofm_for_yield: '',
          max: 0,
          min: 0,
          most_likely: 0
        },
        price: {
          uofm_for_price: '',
          max: 0,
          min: 0,
          most_likely: 0
        }
      },
      achieved: {
        uofm_for_price: '',
        price: 0,
        uofm_for_yield: '',
        yield: 0
      },
      marketable_yield: {
        own:          0,
        seed_reserve: 0
      }
    });

    // Add Main Section to Form
    let formSections = form.sections.slice();
    formSections.push(mainSection._id)
    form = yield FormDal.update({ _id: form._id },{
      sections: formSections
    });

    return form;
  });
}