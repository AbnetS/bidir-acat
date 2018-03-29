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
const ACATDal          = require('../dal/ACAT');
const CostListItemDal   = require('../dal/costListItem');
const GroupedListDal    = require('../dal/groupedList');
const LoanProductDal    = require('../dal/loanProduct');
const LoanProposalDal    = require('../dal/loanProposal');

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

    let clientACAT = yield ClientACAT.findOne({ client: body.client }).exec();
    if(!clientACAT) throw new Error('Client Has Not Client ACAT Yet!!')

    body.client_acat = clientACAT._id;

    let loanProposal = yield LoanProposalDal.get({ client: body.client });
    if(loanProposal) {
      throw new Error('Client has a loan Proposal already!!');
    }

    let loanProduct = yield LoanProductDal.get({ _id: clientACAT.loan_product });
 
    body.cumulative_cash_flow = clientACAT.cumulative_cash_flow;   //This is brought from the client ACAT
    body.net_cash_flow = clientACAT.net_cash_flow;                //This is brought from the client ACAT
    body.total_revenue =  clientACAT.total_revenue;        //This is brought from the client ACAT
    body.total_cost =  clientACAT.total_cost;               //This is brought from the client ACAT
    body.loan_details.deductibles = loanProduct.deductibles.slice();
     body.loan_details.cost_of_loan = loanProduct.cost_of_loan.slice();


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
    let loanProposal = yield LoanProposalDal.get(query);
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

  try {
    let loanProposal = yield LoanProposalDal.update(query, body);
    if(!loanProposal) throw new Error('Loan Proposal Is Not Known!!');

    let clientACAT = yield ClientACAT.findOne({ _id: loanProposal.client }).exec();


    let update = {
      repayable: loanProposal.loan_proposed - (loanProposal.loan_detail.total_deductibles + loanProposal.loan_detail.total_cost_of_loan),
      cumulative_cash_flow: clientACAT.cumulative_cash_flow,   //This is brought from the client ACAT
      net_cash_flow : clientACAT.net_cash_flow,                //This is brought from the client ACAT
      total_revenue :  clientACAT.total_revenue,        //This is brought from the client ACAT
      total_cost :  clientACAT.total_cost
    };

    loanProposal = yield LoanProposalDal.update(query, update);

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