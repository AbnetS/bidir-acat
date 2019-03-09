'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');
const fs      = require('fs');

const debug       = require('debug')('api:form-controller');
const moment      = require('moment');
const jsonStream  = require('streaming-json-stringify');
const _           = require('lodash');
const co          = require('co');
const del         = require('del');
const validator   = require('validator');
const request     = require('request-promise');

const config              = require('../config');
const CustomError         = require('../lib/custom-error');
const checkPermissions    = require('../lib/permissions');
const FORM                = require ('../lib/enums').FORM;

const Section         = require('../models/ACATSection');
const Form            = require('../models/ACATForm');
const Client          = require('../models/client');
const ClientACAT      = require('../models/clientACAT');
const Screening          = require('../models/screening');
const Loan          = require('../models/loan');
const History            = require('../models/history');
const Account         = require('../models/account');

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const SectionDal       = require('../dal/ACATSection');
const CostListDal      = require('../dal/costList');
const ClientACATDal    = require('../dal/clientACAT');
const ACATDal          = require('../dal/ACAT');
const CostListItemDal  = require('../dal/costListItem');
const GroupedListDal   = require('../dal/groupedList');
const LoanProductDal   = require('../dal/loanProduct');
const LoanProposalDal  = require('../dal/loanProposal');
const ClientDal        = require('../dal/client');
const YieldConsumptionDal  = require('../dal/yieldConsumption')
const TaskDal              = require('../dal/task');

let hasPermission = checkPermissions.isPermitted('CLIENT_ACAT');


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

    let clientACAT = yield validateCycle(body)

    let history = yield History.findOne({client: client._id}).exec()
    if (!history) {
      throw new Error('Client Has No Loan History');

    } else {
      history = history.toJSON();

      let cycleOk = true;
      let acatPresent = true;
      let whichCycle = history.cycle_number;
      let missingApplications = [];

      for(let cycle of history.cycles) {
        if (cycle.cycle_number === history.cycle_number) {
          if (!cycle.screening || !cycle.loan) {
            !cycle.screening ? missingApplications.push('Screening') : null;
            !cycle.loan ? missingApplications.push('Loan') : null;
            cycleOk = false;
            break;
          } else if (cycle.acat) {
            acatPresent = false;
            break;
          }
        }
      }

      if (!cycleOk) {
        throw new Error(`Loan Cycle (${whichCycle}) is in progress. Missing ${missingApplications.join(', ')} Application(s)`);
      }

      if (!acatPresent) {
        throw new Error(`Loan Cycle (${whichCycle}) is in progress.`);
      }
    }

    clientACAT = yield ClientACATDal.create({
      client: client._id,
      branch: client.branch,
      created_by: this.state._user._id
    });

    clientACAT = yield ClientACAT.findOne({ _id: clientACAT._id }).exec();

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

    yield ClientDal.update({ _id: client._id },{
      status: 'ACAT_IN_PROGRESS'
    });


    clientACAT = yield ClientACATDal.update({ _id: clientACAT._id },{
      loan_product: body.loan_product,
      status: 'inprogress'
    });

    if (history) {
      let cycles = history.cycles.slice();

      for(let cycle of cycles) {
        if (cycle.cycle_number === history.cycle_number) {
          cycle.acat = clientACAT._id;
          cycle.last_edit_by = this.state._user._id;
        }
      }

      yield History.findOneAndUpdate({
        _id: history._id
      },{
        $set: {
          cycles: cycles,
          last_modified: moment().toISOString()
        }
      }).exec()
    }

    this.body = clientACAT;

  } catch(ex) {
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
      type: 'VIEW_CIENT_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    client: this.params.id
  };

  try {
   
    let clientACAT = yield ClientACAT.findOne(query)
      .sort({ date_created: -1 })
      .exec();
    if(!clientACAT) throw new Error('Client ACAT doesnt exist!!');

    clientACAT = yield ClientACATDal.get({ _id: clientACAT._id });

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
      type: 'UPDATE_CLIENT_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let canApprove = yield hasPermission(this.state._user, 'AUTHORIZE');


  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  this.checkBody('status')
      .notEmpty('Status should not be empty')
      .isIn(['loan_granted', 'loan_paid', 'inprogress','submitted', 'authorized', 'resubmitted', 'declined_for_review'], 'Correct Status is either inprogress, loan_paid resubmitted, authorized, submitted, loan_granted or declined_for_review');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'UPDATE_CLIENT_ACAT_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    delete body.signatures;
    delete body.type;

    let client;
    let task;
    let comment = body.comment;
    let clientACAT = yield ClientACATDal.get(query);
    if(!clientACAT) throw new Error('Client ACAT doesnt exist!!');

    // update client status
    if(body.status == 'submitted'){
      // confirm if crop acats are submitted too
      let isOK = true;
      for(let acat of clientACAT.ACATs) {
        if(acat.status !== 'submitted') {
          isOK = false;
        }
      }

      if(!isOK) {
        throw new Error('Client ACAT crops are not yet submitted');
      }

      let loanProposal = yield LoanProposalDal.get({ client_acat: clientACAT._id });
      if(!loanProposal) {
        throw new Error('Loan Proposal Not Yet Set for client')
      }

      /*if(loanProposal.status != 'submitted') {
        throw new Error('Loan Proposal Not Yet Submitted');
      }*/

      client = yield ClientDal.update({ _id: clientACAT.client._id }, { status: 'ACAT-Submitted' });
      task = yield TaskDal.update({ entity_ref: clientACAT._id }, { status: 'completed', comment: comment });

      // Create Task
      yield TaskDal.create({
        task: `Approve Client ACAT of ${client.first_name} ${client.last_name}`,
        task_type: 'approve',
        entity_ref: clientACAT._id,
        entity_type: 'clientACAT',
        created_by: this.state._user._id,
        branch: client.branch._id,
        comment: body.comment ? body.comment : ''
      })

    } else if(body.status == 'declined_for_review') {
      client = yield ClientDal.update({ _id: clientACAT.client._id }, { status: 'ACAT-Declined-For-Review' });
      task = yield TaskDal.update({ entity_ref: clientACAT._id }, { status: 'completed', comment: comment });

      // Create Task
      yield TaskDal.create({
        task: `Client ACAT of ${client.first_name} ${client.last_name} Declined For Review`,
        task_type: 'review',
        entity_ref: clientACAT._id,
        entity_type: 'clientACAT',
        created_by: clientACAT.created_by ? clientACAT.created_by._id : null,
        branch: client.branch._id,
        comment: body.comment ? body.comment : ''
      })

    } else if(body.status == 'resubmitted') {
      client = yield ClientDal.update({ _id: clientACAT.client._id }, { status: 'ACAT-Resubmitted' });
      task = yield TaskDal.update({ entity_ref: clientACAT._id }, { status: 'completed', comment: comment });

      // Create Task
      yield TaskDal.create({
        task: `Client ACAT of ${client.first_name} ${client.last_name} Resubmitted`,
        task_type: 'approve',
        entity_ref: clientACAT._id,
        entity_type: 'clientACAT',
        created_by: this.state._user._id,
        branch: client.branch._id,
        comment: body.comment ? body.comment : ''
      })

    } else if(body.status == 'authorized') {
      // confirm if crop acats are submitted too0
      let isOK = true;
      for(let acat of clientACAT.ACATs) {
        if(acat.status !== 'authorized') {
          isOK = false;
        }
      }

      if(!isOK) {
        throw new Error('Client ACAT crops are not yet authorized');
      }

      let loanProposal = yield LoanProposalDal.get({ client_acat: clientACAT._id });
      if(!loanProposal) {
        throw new Error('Loan Proposal Not Yet Set for client')
      }

      /*if(loanProposal.status != 'authorized') {
        throw new Error('Loan Proposal Not Yet Authorized');
      }*/

      client = yield ClientDal.update({ _id: clientACAT.client._id }, { status: 'ACAT-Authorized' });
      task = yield TaskDal.update({ entity_ref: clientACAT._id }, { status: 'completed', comment: comment });

    } else if(body.status == 'loan_granted') {
      // confirm if crop acats are submitted too0
      let isOK = true;
      for(let acat of clientACAT.ACATs) {
        if(acat.status !== 'authorized') {
          isOK = false;
        }
      }

      if(!isOK) {
        throw new Error('Client ACAT crops are not yet authorized');
      }

      let loanProposal = yield LoanProposalDal.get({ client_acat: clientACAT._id });
      if(!loanProposal) {
        throw new Error('Loan Proposal Not Yet Set for client')
      }

      /*if(loanProposal.status != 'authorized') {
        throw new Error('Loan Proposal Not Yet Authorized');
      }*/

      client = yield ClientDal.update({ _id: clientACAT.client._id }, { status: 'Loan-Granted' });

    }

   clientACAT = yield ClientACATDal.update(query, body);

   for(let acat of clientACAT.ACATs) {
     //yield computeValues(acat);
   }

   clientACAT = yield ClientACATDal.get(query);

    yield LogDal.track({
      event: 'client_acat_update',
      user: this.state._user._id ,
      message: `Update Info for ${clientACAT._id}`,
      diff: body
    });

    this.body = clientACAT;

  } catch(ex) {
    console.log(ex)
    return this.throw(new CustomError({
      type: 'UPDATE_CLIENT_ACAT_ERROR',
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
  
  //let canViewAll =  yield hasPermission(this.state._user, 'VIEW_ALL');
  let canView =  yield hasPermission(this.state._user, 'VIEW');

  try {
    
    let user = this.state._user;
    let account = yield Account.findOne({ user: user._id }).exec();

    // Super Admin
    if (!account || (account.multi_branches)) {
        query = {};       
        

    //TODO: But need to be considered....
        // Can VIEW ALL
    // } else if (canViewAll) {
    //   if(account.access_branches.length) {
    //       query.branch = { $in: account.access_branches.slice() };

    //   } else if(account.default_branch) {
    //       query.branch = account.default_branch;

    //   }  
      
    // Can VIEW
    // } else if(canView) {
    //   query = {
    //     created_by: user._id
    // };

    // DEFAULT
    } else {
      // query = {
      //     created_by: user._id
      //   };
        query.created_by = user._id
        
    }


    let clientACATs = yield ClientACATDal.getCollectionByPagination(query, opts);

    this.body = clientACATs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_CLIENT_ACAT_COLLECTION_ERROR',
      message: ex.message+query
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
exports.search = function* searchClientACAT(next) {
  debug('search client acats');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'SEARCH_CLIENT_ACAT_COLLECTION_ERROR',
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

  let canViewAll =  yield hasPermission(this.state._user, 'VIEW_ALL');
  let canView =  yield hasPermission(this.state._user, 'VIEW');

  try {
    let user = this.state._user;
    let account = yield Account.findOne({ user: user._id }).exec();

    let searchTerm = this.query.search;
    if(!searchTerm) {
      throw new Error('Please Provide A Search Term');
    }

    // Super Admin
    if (!account || (account.multi_branches && canViewAll)) {
        query = {};

    // Can VIEW ALL
    } else if (canViewAll) {
      if(account.access_branches.length) {
          query.branch = { $in: account.access_branches };

      } else if(account.default_branch) {
          query.branch = account.default_branch;

      }

    // Can VIEW
    } else if(canView) {
        query = {
          created_by: user._id
        };

    // DEFAULT
    } else {
      query = {
          created_by: user._id
        };
    }

    let terms = searchTerm.split(/\s+/);
    let groupTerms = { $in: [] };
    let refTerms = {$in:[]}

    for(let term of terms) {
      if(validator.isMongoId(term)) {
        refTerms.$in.push(term);
      } else {

        term = new RegExp(`${term}`, 'i')

        groupTerms.$in.push(term);
      }
    }

    query.$or = [];

    if (refTerms.$in.length) {
      query.$or.push({
        client: searchTerm
      },{
        branch: searchTerm
      },{
        created_by: searchTerm
      },{
        loan_product: searchTerm
      });
    } else {
      query.$or.push({
        status: searchTerm
      },{
        filling_status: searchTerm
      });
    }

    let fields = null;
    if (this.query.fields) {
      fields = {};
      this.query.fields.split(",").forEach(function remap(field){
        fields[field] = 1;
      })
    }

    let clientACATs = yield ClientACATDal.getCollectionByPagination(query, opts, fields);

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
      delete section.cost_list._id;
      let costList    = yield createCostList(section.cost_list);

      section.cost_list = costList._id;
    }

    if(section.yield) {
      delete section.yield._id;
      let _yield    = yield CostListItemDal.create(section.yield);

      section.yield = _yield._id;
    }

    if(section.yield_consumption) {
      delete section.yield_consumption._id;
      let yieldConsumption    = yield YieldConsumptionDal.create({});

      section.yield_consumption = yieldConsumption._id;
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

    return acat;

  })
}

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


function validateCycle(body) {
  return co(function*(){
    debug("Validating loan cycle")
    // Validate Screenings
    let screenings = yield Screening.find({ client: body.client })
      .sort({ date_created: -1 })
      .exec();
    if(!screenings.length) {
      throw new Error('Client Has Not Screening Form Yet!');
    }

    for(let screening of screenings) {
      if(screening.status === "new" || screening.status === "screening_inprogress" || screening.status === "submitted") {
        throw new Error('Client Has A Screening in progress!!')
      }
    }

    // Validate Loans
    let loans = yield Loan.find({ client: body.client })
      .sort({ date_created: -1 })
      .exec();

    for(let loan of loans) {
      if(loan.status === 'new' || loan.status === 'submitted' || loan.status === "inprogress") {
        throw new Error('Client Has A Loan in progress!!')
      }
    }

    // Validate acats
    let clientACATS = yield ClientACAT.find({ client: body.client })
      .sort({ date_created: -1 })
      .exec();

    for(let acat of clientACATS) {
      if(acat.status === 'new' || acat.status === 'submitted' || acat.status === 'resubmitted' || acat.status === "inprogress") {
        throw new Error('Client Has An ACAT in progress!!')
      }
    }

    let clientACAT = yield ClientACAT.findOne({ client: body.client })
      .sort({ date_created: -1 })
      .exec();

    return clientACAT;
    
  })
}