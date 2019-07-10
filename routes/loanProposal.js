'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:loanProposal-router');

const loanProposalController  = require('../controllers/loanProposal');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /acat/loanProposals/create Create new LoanProposal
 * @apiVersion 1.0.0
 * @apiName CreateLoanProposal
 * @apiGroup LoanProposal
 *
 * @apiDescription Create new LoanProposal. 
 *
 * @apiParam {String} client_acat Client ACAT Reference
 * @apiParam {String} client Client Reference
 *
 * @apiParamExample Request Example:
 *  {
 *    client : "556e1174a8952c9521286a60",
 *    client_acat : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} name LoanProposal Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {Array} deductibles Deductibles List
 * @apiSuccess {Array} cost_of_loan Cost of Loan
 * @apiSuccess {String} currency Currency
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Loan Something Something",
 *    maximum_loan_amount : 100000000000000000000000000000,
 *    currency: "$"
 *    deductibles: [],
 *    cost_of_loan: [],
 *    ...
 *  }
 *
 */
router.post('/create', acl(['*']), loanProposalController.create);



/**
 * @api {get} /acat/loanProposals/:id Get LoanProposal
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup LoanProposal
 *
 * @apiDescription Get a user loanProposal with the given id
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} name LoanProposal Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {Array} deductibles Deductibles List
 * @apiSuccess {Array} cost_of_loan Cost of Loan
 * @apiSuccess {String} currency Currency
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Loan Something Something",
 *    maximum_loan_amount : 100000000000000000000000000000,
 *    currency: "$"
 *    deductibles: [{
 *      fixed_amount: 0,
 *      percent: 5 ,
 *      item: "Item"
 *    }],
 *    cost_of_loan: [{
 *      fixed_amount: 0,
 *      percent: 5,
 *      item: "Item"
 *    }],
 *    ...
 *  }
 *
 */
router.get('/:id', acl(['*']), loanProposalController.fetchOne);

/**
 * @api {get} /acat/loanProposals/clients/:id Get Client LoanProposal
 * @apiVersion 1.0.0
 * @apiName GetClientLoanProposal
 * @apiGroup LoanProposal
 *
 * @apiDescription Get a client loanProposal with the given id
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} name LoanProposal Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {Array} deductibles Deductibles List
 * @apiSuccess {Array} cost_of_loan Cost of Loan
 * @apiSuccess {String} currency Currency
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Loan Something Something",
 *    maximum_loan_amount : 100000000000000000000000000000,
 *    currency: "$"
 *    deductibles: [{
 *      fixed_amount: 0,
 *      percent: 5 ,
 *      item: "Item"
 *    }],
 *    cost_of_loan: [{
 *      fixed_amount: 0,
 *      percent: 5,
 *      item: "Item"
 *    }],
 *    ...
 *  }
 *
 */
router.get('/clients/:id', acl(['*']), loanProposalController.getClientLoanProposal);


/**
 * @api {put} /acat/loanProposals/:id Update LoanProposal
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup LoanProposal 
 *
 * @apiDescription Update a LoanProposal loanProposal with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    name: "Crop Fertiliser and Chemicals Distribution "
 * }
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} name LoanProposal Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {Array} deductibles Deductibles List
 * @apiSuccess {Array} cost_of_loan Cost of Loan
 * @apiSuccess {String} currency Currency
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Loan Something Something",
 *    maximum_loan_amount : 100000000000000000000000000000,
 *    currency: "$"
 *    deductibles: [{
 *      fixed_amount: 0,
 *      percent: 5,
 *      item: "Item" 
 *    }],
 *    cost_of_loan: [{
 *      fixed_amount: 0,
 *      percent: 5,
 *      item: "Item" 
 *    }],
 *    ...
 *  }
 */
router.put('/:id', acl(['*']), loanProposalController.update);

/**
 * @api {get} /acat/loanProposals/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get LoanProposals collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup LoanProposal
 *
 * @apiDescription Get a collection of loanProposals. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} name LoanProposal Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {Array} deductibles Deductibles List
 * @apiSuccess {Array} cost_of_loan Cost of Loan
 * @apiSuccess {String} currency Currency
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Loan Something Something",
 *    maximum_loan_amount : 100000000000000000000000000000,
 *    currency: "$"
 *    deductibles: [{
 *      fixed_amount: 0,
 *      percent: 5,
 *      item: "Item" 
 *    }],
 *    cost_of_loan: [{
 *      fixed_amount: 0,
 *      percent: 5,
 *      item: "Item" 
 *    }],
 *    ...
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), loanProposalController.fetchAllByPagination);

router.get('/acat/:id', acl(['*']), loanProposalController.getACATLoanProposal);

// Expose LoanProposal Router
module.exports = router;