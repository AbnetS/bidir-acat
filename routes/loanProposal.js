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
 * @api {post} /acat/loanProposals/create Create new Loan Proposal
 * @apiVersion 1.0.0
 * @apiName CreateLoanProposal
 * @apiGroup Loan Proposal
 *
 * @apiDescription Create a new Loan Proposal. 
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
 * @apiSuccess {String} client Client ID for which loan proposal is created 
 * @apiSuccess {String} client Client ACAT application ID 
 * @apiSuccess {String} status Status of the loan proposal
 * @apiSuccess {Number} total_cost Total cost copied from the ACAT application
 * @apiSuccess {Number} total_revenue Total revenue copied from the ACAT application
 * @apiSuccess {Object} net_cash_flow Net cashflow copied from the ACAT application
 * @apiSuccess {Object} cumulative_cash_flow Cumulative cashflow from the ACAT application
 * @apiSuccess {Number} loan_requested Loan requested
 * @apiSuccess {Number} loan_approved Loan approved
 * @apiSuccess {Number} loan_proposed Loan proposed
 * @apiSuccess {Object} loan_detail Details of the loan
 * @apiSuccess {Number} loan_detail.max_amount Maximum amount of the selected loan product
 * @apiSuccess {Number} loan_detail.total_deductibles Total amount of deductibles
 * @apiSuccess {Number} loan_detail.total_cost_of_loan Total amount of cost of loan
 * @apiSuccess {Object[]} loan_detail.deductibes List of deductibles
 * @apiSuccess {Object[]} loan_detail.cost_of_loan List of cost of loan
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3868e0dd2d931083c76ae",
        "last_modified": "2019-12-13T12:39:42.386Z",
        "date_created": "2019-12-13T12:39:42.386Z",
        "client": "5bd057573620aa0001c26c21",
        "client_acat": "5bd05c04017721000162bdfb",
        "created_by": "5b925494b1cfc10001d80908",
        "comment": "",
        "layout": "TWO_COLUMNS",
        "loan_detail": {
            "cost_of_loan": [
                {
                    "_id": "5b92856fac942500011c1120",
                    "item": "Interest",
                    "percent": 24,
                    "fixed_amount": 0
                }
            ],
            "deductibles": [],
            "total_cost_of_loan": 0,
            "total_deductibles": 0,
            "max_amount": 0
        },
        "loan_proposed": 0,
        "loan_approved": 0,
        "loan_requested": 0,
        "cumulative_cash_flow": {
            "dec": -56490,
            "nov": -56490,
            "oct": -56490,
            "sep": -56490,
            "aug": -56490,
            "july": -36330,
            "june": -35010,
            "may": -32190,
            "apr": -14870,
            "mar": -57490,
            "feb": -56490,
            "jan": -56490
        },
        "repayable": 0,
        "net_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            "sep": 0,
            "aug": 0,
            "july": 0,
            "june": 0,
            "may": 0,
            "apr": 0,
            "mar": 0,
            "feb": 0,
            "jan": 0
        },
        "total_revenue": 151872,
        "total_cost": 66290,
        "status": "new"
 *  }
 *
 */
router.post('/create', acl(['*']), loanProposalController.create);



/**
 * @api {get} /acat/loanProposals/:id Get LoanProposal
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Loan Proposal
 *
 * @apiDescription Get a loanProposal with the given id
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} client Client ID for which loan proposal is created 
 * @apiSuccess {String} client Client ACAT application ID 
 * @apiSuccess {String} status Status of the loan proposal
 * @apiSuccess {Number} total_cost Total cost copied from the ACAT application
 * @apiSuccess {Number} total_revenue Total revenue copied from the ACAT application
 * @apiSuccess {Object} net_cash_flow Net cashflow copied from the ACAT application
 * @apiSuccess {Object} cumulative_cash_flow Cumulative cashflow from the ACAT application
 * @apiSuccess {Number} loan_requested Loan requested
 * @apiSuccess {Number} loan_approved Loan approved
 * @apiSuccess {Number} loan_proposed Loan proposed
 * @apiSuccess {Object} loan_detail Details of the loan
 * @apiSuccess {Number} loan_detail.max_amount Maximum amount of the selected loan product
 * @apiSuccess {Number} loan_detail.total_deductibles Total amount of deductibles
 * @apiSuccess {Number} loan_detail.total_cost_of_loan Total amount of cost of loan
 * @apiSuccess {Object[]} loan_detail.deductibes List of deductibles
 * @apiSuccess {Object[]} loan_detail.cost_of_loan List of cost of loan
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3868e0dd2d931083c76ae",
        "last_modified": "2019-12-13T12:39:42.386Z",
        "date_created": "2019-12-13T12:39:42.386Z",
        "client": "5bd057573620aa0001c26c21",
        "client_acat": "5bd05c04017721000162bdfb",
        "created_by": "5b925494b1cfc10001d80908",
        "comment": "",
        "layout": "TWO_COLUMNS",
        "loan_detail": {
            "cost_of_loan": [
                {
                    "_id": "5b92856fac942500011c1120",
                    "item": "Interest",
                    "percent": 24,
                    "fixed_amount": 0
                }
            ],
            "deductibles": [],
            "total_cost_of_loan": 0,
            "total_deductibles": 0,
            "max_amount": 0
        },
        "loan_proposed": 0,
        "loan_approved": 0,
        "loan_requested": 0,
        "cumulative_cash_flow": {
            "dec": -56490,
            "nov": -56490,
            "oct": -56490,
            ...
        },
        "repayable": 0,
        "net_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "total_revenue": 151872,
        "total_cost": 66290,
        "status": "new" *  
 *  }
 *
 */
router.get('/:id', acl(['*']), loanProposalController.fetchOne);

/**
 * @api {get} /acat/loanProposals/clients/:clientId Get Client Loan Proposal
 * @apiVersion 1.0.0
 * @apiName GetClientLoanProposal
 * @apiGroup Loan Proposal
 *
 * @apiDescription Get a client loanProposal with the given id
 *
 * @apiExample Usage Example
 * api.test.bidir.gebeya.co/acat/loanProposals/clients/5bd057573620aa0001c26c21

 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} client Client ID for which loan proposal is created 
 * @apiSuccess {String} client Client ACAT application ID 
 * @apiSuccess {String} status Status of the loan proposal
 * @apiSuccess {Number} total_cost Total cost copied from the ACAT application
 * @apiSuccess {Number} total_revenue Total revenue copied from the ACAT application
 * @apiSuccess {Object} net_cash_flow Net cashflow copied from the ACAT application
 * @apiSuccess {Object} cumulative_cash_flow Cumulative cashflow from the ACAT application
 * @apiSuccess {Number} loan_requested Loan requested
 * @apiSuccess {Number} loan_approved Loan approved
 * @apiSuccess {Number} loan_proposed Loan proposed
 * @apiSuccess {Object} loan_detail Details of the loan
 * @apiSuccess {Number} loan_detail.max_amount Maximum amount of the selected loan product
 * @apiSuccess {Number} loan_detail.total_deductibles Total amount of deductibles
 * @apiSuccess {Number} loan_detail.total_cost_of_loan Total amount of cost of loan
 * @apiSuccess {Object[]} loan_detail.deductibes List of deductibles
 * @apiSuccess {Object[]} loan_detail.cost_of_loan List of cost of loan
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3868e0dd2d931083c76ae",
        "last_modified": "2019-12-13T12:39:42.386Z",
        "date_created": "2019-12-13T12:39:42.386Z",
        "client": "5bd057573620aa0001c26c21",
        "client_acat": "5bd05c04017721000162bdfb",
        "created_by": "5b925494b1cfc10001d80908",
        "comment": "",
        "layout": "TWO_COLUMNS",
        "loan_detail": {
            "cost_of_loan": [
                {
                    "_id": "5b92856fac942500011c1120",
                    "item": "Interest",
                    "percent": 24,
                    "fixed_amount": 0
                }
            ],
            "deductibles": [],
            "total_cost_of_loan": 0,
            "total_deductibles": 0,
            "max_amount": 0
        },
        "loan_proposed": 0,
        "loan_approved": 0,
        "loan_requested": 0,
        "cumulative_cash_flow": {
            "dec": -56490,
            "nov": -56490,
            "oct": -56490,
            ...
        },
        "repayable": 0,
        "net_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "total_revenue": 151872,
        "total_cost": 66290,
        "status": "new" 
 *  }
 *
 */
router.get('/clients/:id', acl(['*']), loanProposalController.getClientLoanProposal);


/**
 * @api {put} /acat/loanProposals/:id Update Loan Proposal
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Loan Proposal 
 *
 * @apiDescription Update a loanProposal with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
*       "loan_requested":100000,
        "loan_proposed": 80000,
        "status":"inprogress"
 * }
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} client Client ID for which loan proposal is created 
 * @apiSuccess {String} client Client ACAT application ID 
 * @apiSuccess {String} status Status of the loan proposal
 * @apiSuccess {Number} total_cost Total cost copied from the ACAT application
 * @apiSuccess {Number} total_revenue Total revenue copied from the ACAT application
 * @apiSuccess {Object} net_cash_flow Net cashflow copied from the ACAT application
 * @apiSuccess {Object} cumulative_cash_flow Cumulative cashflow from the ACAT application
 * @apiSuccess {Number} loan_requested Loan requested
 * @apiSuccess {Number} loan_approved Loan approved
 * @apiSuccess {Number} loan_proposed Loan proposed
 * @apiSuccess {Object} loan_detail Details of the loan
 * @apiSuccess {Number} loan_detail.max_amount Maximum amount of the selected loan product
 * @apiSuccess {Number} loan_detail.total_deductibles Total amount of deductibles
 * @apiSuccess {Number} loan_detail.total_cost_of_loan Total amount of cost of loan
 * @apiSuccess {Object[]} loan_detail.deductibes List of deductibles
 * @apiSuccess {Object[]} loan_detail.cost_of_loan List of cost of loan
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3868e0dd2d931083c76ae",
        "last_modified": "2019-12-13T12:39:42.386Z",
        "date_created": "2019-12-13T12:39:42.386Z",
        "client": "5bd057573620aa0001c26c21",
        "client_acat": "5bd05c04017721000162bdfb",
        "created_by": "5b925494b1cfc10001d80908",
        "comment": "",
        "layout": "TWO_COLUMNS",
        "loan_detail": {
            "cost_of_loan": [
                {
                    "_id": "5b92856fac942500011c1120",
                    "item": "Interest",
                    "percent": 24,
                    "fixed_amount": 0
                }
            ],
            "deductibles": [],
            "total_cost_of_loan": 0,
            "total_deductibles": 0,
            "max_amount": 0
        },
        "loan_proposed": 80000,
        "loan_approved": 0,
        "loan_requested": 100000,
        "cumulative_cash_flow": {
            "dec": -56490,
            "nov": -56490,
            "oct": -56490,
            ...
        },
        "repayable": 0,
        "net_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "total_revenue": 151872,
        "total_cost": 66290,
        "status": "inprogress" 
 *  }
 */
router.put('/:id', acl(['*']), loanProposalController.update);

/**
 * @api {get} /acat/loanProposals/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get LoanProposals collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Loan Proposal
 *
 * @apiDescription Get a collection of loanProposals. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} client Client ID for which loan proposal is created 
 * @apiSuccess {String} client Client ACAT application ID 
 * @apiSuccess {String} status Status of the loan proposal
 * @apiSuccess {Number} total_cost Total cost copied from the ACAT application
 * @apiSuccess {Number} total_revenue Total revenue copied from the ACAT application
 * @apiSuccess {Object} net_cash_flow Net cashflow copied from the ACAT application
 * @apiSuccess {Object} cumulative_cash_flow Cumulative cashflow from the ACAT application
 * @apiSuccess {Number} loan_requested Loan requested
 * @apiSuccess {Number} loan_approved Loan approved
 * @apiSuccess {Number} loan_proposed Loan proposed
 * @apiSuccess {Object} loan_detail Details of the loan
 * @apiSuccess {Number} loan_detail.max_amount Maximum amount of the selected loan product
 * @apiSuccess {Number} loan_detail.total_deductibles Total amount of deductibles
 * @apiSuccess {Number} loan_detail.total_cost_of_loan Total amount of cost of loan
 * @apiSuccess {Object[]} loan_detail.deductibes List of deductibles
 * @apiSuccess {Object[]} loan_detail.cost_of_loan List of cost of loan
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
    "total_pages": 1,
    "total_docs_count": 115,
    "current_page": 1,
    "docs": [
        {
            "_id": "5df3868e0dd2d931083c76ae",
            ...
        },
        {
            ...
        }
    ]
 *  }
 */
router.get('/paginate', acl(['*']), loanProposalController.fetchAllByPagination);

/**
 * @api {get} /acat/loanProposals/acat/:clientACATId Get Loan Proposal by ACAT Application
 * @apiVersion 1.0.0
 * @apiName GetLoanProposalByACAT
 * @apiGroup Loan Proposal
 *
 * @apiDescription Get a loanProposal created for the given ACAT application Id
 *
 * @apiExample Usage Example
 * api.test.bidir.gebeya.co/acat/loanProposals/acat/5bd05c04017721000162bdfb

 * @apiSuccess {String} _id loanProposal id
 * @apiSuccess {String} client Client ID for which loan proposal is created 
 * @apiSuccess {String} client Client ACAT application ID 
 * @apiSuccess {String} status Status of the loan proposal
 * @apiSuccess {Number} total_cost Total cost copied from the ACAT application
 * @apiSuccess {Number} total_revenue Total revenue copied from the ACAT application
 * @apiSuccess {Object} net_cash_flow Net cashflow copied from the ACAT application
 * @apiSuccess {Object} cumulative_cash_flow Cumulative cashflow from the ACAT application
 * @apiSuccess {Number} loan_requested Loan requested
 * @apiSuccess {Number} loan_approved Loan approved
 * @apiSuccess {Number} loan_proposed Loan proposed
 * @apiSuccess {Object} loan_detail Details of the loan
 * @apiSuccess {Number} loan_detail.max_amount Maximum amount of the selected loan product
 * @apiSuccess {Number} loan_detail.total_deductibles Total amount of deductibles
 * @apiSuccess {Number} loan_detail.total_cost_of_loan Total amount of cost of loan
 * @apiSuccess {Object[]} loan_detail.deductibes List of deductibles
 * @apiSuccess {Object[]} loan_detail.cost_of_loan List of cost of loan
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3868e0dd2d931083c76ae",
        "last_modified": "2019-12-13T12:39:42.386Z",
        "date_created": "2019-12-13T12:39:42.386Z",
        "client": "5bd057573620aa0001c26c21",
        "client_acat": "5bd05c04017721000162bdfb",
        "created_by": "5b925494b1cfc10001d80908",
        "comment": "",
        "layout": "TWO_COLUMNS",
        "loan_detail": {
            "cost_of_loan": [
                {
                    "_id": "5b92856fac942500011c1120",
                    "item": "Interest",
                    "percent": 24,
                    "fixed_amount": 0
                }
            ],
            "deductibles": [],
            "total_cost_of_loan": 0,
            "total_deductibles": 0,
            "max_amount": 0
        },
        "loan_proposed": 0,
        "loan_approved": 0,
        "loan_requested": 0,
        "cumulative_cash_flow": {
            "dec": -56490,
            "nov": -56490,
            "oct": -56490,
            ...
        },
        "repayable": 0,
        "net_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "total_revenue": 151872,
        "total_cost": 66290,
        "status": "new" 
    }
*/

router.get('/acat/:id', acl(['*']), loanProposalController.getACATLoanProposal);

// Expose LoanProposal Router
module.exports = router;