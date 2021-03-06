'use strict';
/**
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:loanProposal-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');
const _          = require('lodash');
const co         = require('co');
const del        = require('del');
const validator  = require('validator');

const config             = require('../config');
const CustomError        = require('../lib/custom-error');
const checkPermissions   = require('../lib/permissions');


const Section         = require('../models/ACATSection');
const Form            = require('../models/ACATForm');
const Client          = require('../models/client');
const ClientACAT      = require('../models/clientACAT');
const LoanProposal    = require('../models/loanProposal');

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const SectionDal       = require('../dal/ACATSection');
const CostListDal      = require('../dal/costList');
const ClientACATDal    = require('../dal/clientACAT');
const ClientDal        = require('../dal/client');
const ACATDal          = require('../dal/ACAT');
const CostListItemDal   = require('../dal/costListItem');
const GroupedListDal    = require('../dal/groupedList');
const LoanProductDal    = require('../dal/loanProduct');
const LoanProposalDal    = require('../dal/loanProposal');
const TaskDal    = require('../dal/task');
const NotificationDal          = require('../dal/notification');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Create a loanProposal.
 *
 * @desc create a loanProposal using basic Authentication or Social Media
 *
 * @param {Function} next Middleware dispatcher
 *
 */
exports.create = function* createLoanProposal(next) {
  debug('create question loanProposal');

  let isPermitted = yield hasPermission(this.state._user, 'CREATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'CREATE_LOAN_PROPOSAL_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let body = this.request.body;

  this.checkBody('client')
      .notEmpty('Client reference is Empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CREATE_LOAN_PROPOSAL_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {

    body.created_by = this.state._user._id;

    let clientACAT = yield ClientACAT.findOne({ client: body.client })
      .sort({ date_created: -1 })
      .exec();
    if(!clientACAT) throw new Error('Client Has Not Client ACAT Yet!!')

    body.client_acat = clientACAT._id;

    let loanProposal = yield LoanProposalDal.get({ client: body.client });
    if(loanProposal) {
      //throw new Error('Client has a loan Proposal already!!');
    }

    let loanProduct = yield LoanProductDal.get({ _id: clientACAT.loan_product });
    if(!loanProduct) {
      throw new Error('Loan Product Is Missing');
    }

    body.cumulative_cash_flow = clientACAT.estimated.net_cash_flow;   //This is brought from the client ACAT
    body.net_cash_flow = clientACAT.estimated.net_income;                //This is brought from the client ACAT
    body.total_revenue =  clientACAT.estimated.total_revenue;        //This is brought from the client ACAT
    body.total_cost =  clientACAT.estimated.total_cost;

    if(body.loan_detail) {
      body.loan_detail.deductibles = loanProduct.deductibles.slice();
      body.loan_detail.cost_of_loan = loanProduct.cost_of_loan.slice();
    } else {
      body.loan_detail = {
        deductibles: loanProduct.deductibles.slice(),
        cost_of_loan: loanProduct.cost_of_loan.slice()
      }
    }

    loanProposal = yield LoanProposalDal.create(body);

    this.body = loanProposal;

  } catch(ex) {
    this.throw(new CustomError({
      type: 'CREATE_LOAN_PROPOSAL_ERROR',
      message: ex.message
    }));
  }

};


/**
 * Get a single loanProposal.
 *
 * @desc Fetch a loanProposal with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneLoanProposal(next) {
  debug(`fetch loanProposal: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let loanProposal = yield LoanProposalDal.get(query);
    if(!loanProposal) throw new Error('Loan Proposal is not known!')

    yield LogDal.track({
      event: 'view_loanProposal',
      loanProposal: this.state._user._id ,
      message: `View loanProposal - ${loanProposal.name}`
    });

    this.body = loanProposal;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_LOAN_PROPOSAL_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get client loanProposal.
 *
 * @desc Fetch a loanProposal with the given client from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.getClientLoanProposal = function* getClientLoanProposal(next) {
  debug(`fetch client loanProposal: ${this.params.id}`);

  let query = {
    client: this.params.id
  };

  try {
    let loanProposal = yield LoanProposal.findOne(query)
      .sort({ date_created: -1 })
      .exec();
    if(!loanProposal) throw new Error('Loan Proposal is not known!')

    yield LogDal.track({
      event: 'view_loanProposal',
      user: this.state._user._id ,
      message: `View loanProposal - ${loanProposal._id}`
    });

    this.body = loanProposal;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_LOAN_PROPOSAL_ERROR',
      message: ex.message
    }));
  }

};

exports.getACATLoanProposal = function* getACATLoanProposal(next) {
  debug(`fetch client loanProposal for a specific ACAT: ${this.params.id}`);

  let query = {
    client_acat: this.params.id
  };

  try {
    let loanProposal = yield LoanProposal.findOne(query)
      .sort({ date_created: -1 })
      .exec();
    if(!loanProposal) throw new Error('Loan Proposal is not known!')

    yield LogDal.track({
      event: 'view_loanProposal',
      user: this.state._user._id ,
      message: `View loanProposal - ${loanProposal._id}`
    });

    this.body = loanProposal;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_LOAN_PROPOSAL_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single loanProposal.
 *
 * @desc Fetch a loanProposal with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateLoanProposal(next) {
  debug(`updating loanProposal: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_LOAN_PROPOSAL_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  let canApprove = yield hasPermission(this.state._user, 'AUTHORIZE');

  this.checkBody('status')
      .notEmpty('Status should not be empty')
      .isIn(['loan_paid','inprogress', 'submitted', 'resubmitted', 'authorized', 'declined_for_review'], 'Correct Status is either loan_paid, inprogress, resubmitted, authorized, submitted or declined_for_review');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'UPDATE_LOAN_PROPOSAL_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let loanProposal = yield LoanProposalDal.update(query, body);
    if(!loanProposal) throw new Error('Loan Proposal Is Not Known!!');

    let client;
    let clientACAT = yield ClientACAT.findOne({ _id: loanProposal.client_acat }).exec();
    if(!clientACAT) {
      throw new Error('Client Does Not Have a client ACAT yet!');
    }
    let comment = body.comment;

    if(body.status == 'declined_for_review') {
      client = yield ClientDal.update({ _id: loanProposal.client }, { status: 'ACAT_Declined_For_Review' });
      yield ClientACATDal.update({ _id: clientACAT._id },{ status: 'declined_for_review' });
      let task = yield TaskDal.update({ entity_ref: loanProposal._id }, { status: 'completed', comment: comment });
      if(task) {
        // Create Review Task
        let _task = yield TaskDal.create({
          task: `Review Loan Proposal Application of ${client.first_name} ${client.last_name}`,
          task_type: 'review',
          entity_ref: loanProposal._id,
          entity_type: 'LoanProposal',
          created_by: this.state._user._id,
          user: loanProposal.created_by,
          branch: client.branch._id,
          comment: comment
        });
        yield NotificationDal.create({
          for: loanProposal.created_by,
          message: `Loan Proposal Application of ${client.first_name} ${client.last_name} has been declined For Further Review`,
          task_ref: _task._id
        });
      }


    } else if(body.status == 'resubmitted') {
      client = yield ClientDal.update({ _id: loanProposal.client }, { status: 'ACAT_Resubmitted' });
      yield ClientACATDal.update({ _id: clientACAT._id },{ status: 'resubmitted' });
      let task = yield TaskDal.update({ entity_ref: loanProposal._id }, { status: 'completed', comment: comment });
      if(task) {
        yield NotificationDal.create({
          for: task.created_by,
          message: `Loan Proposal Application of ${client.first_name} ${client.last_name} has been Resubmitted`,
          task_ref: task._id
        });
      }

    } else if(body.status == 'authorized'){
      client = yield ClientDal.update({ _id: loanProposal.client }, { status: 'ACAT_Authorized' });
      yield ClientACATDal.update({ _id: clientACAT._id },{ status: 'authorized' });
      let task = yield TaskDal.update({ entity_ref: loanProposal._id }, { status: 'completed', comment: comment });
      if(task && task._id) {
        yield NotificationDal.create({
          for: task.created_by,
          message: `Loan Proposal Application of ${client.first_name} ${client.last_name} has been authorized`,
          task_ref: task._id
        });
      }
    }

    // Computations
    let update = {
      repayable: loanProposal.loan_proposed - (loanProposal.loan_detail.total_deductibles + loanProposal.loan_detail.total_cost_of_loan),
      cumulative_cash_flow: clientACAT.estimated.net_cash_flow,   //This is brought from the client ACAT
      net_cash_flow : clientACAT.estimated.net_income,                //This is brought from the client ACAT
      total_revenue :  clientACAT.estimated.total_revenue,        //This is brought from the client ACAT
      total_cost :  clientACAT.estimated.total_cost
    };

    yield LogDal.track({
      event: 'loanProposal_update',
      user: this.state._user._id ,
      message: `Update Info for ${loanProposal.name}`,
      diff: body
    });

    this.body = loanProposal;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_LOAN_PROPOSAL_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of loanProposals by Pagination
 *
 * @desc Fetch a collection of loanProposals
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllLoanProposals(next) {
  debug('get a collection of loanProposals by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_LOAN_PROPOSALS_COLLECTION_ERROR',
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
    let loanProposals = yield LoanProposalDal.getCollectionByPagination(query, opts);

    this.body = loanProposals;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_LOAN_PROPOSALS_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};
