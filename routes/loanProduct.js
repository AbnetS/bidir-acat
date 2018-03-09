'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:loanProduct-router');

const loanProductController  = require('../controllers/loanProduct');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /acat/loan-products/create Create new LoanProduct
 * @apiVersion 1.0.0
 * @apiName CreateLoanProduct
 * @apiGroup LoanProduct
 *
 * @apiDescription Create new LoanProduct. 
 *
 * @apiParam {String} name LoanProduct Name
 * @apiParam {String} maximum_loan_amount LoanProduct Maximum Loan Amount
 * @apiParam {String} [currency] LoanProduct Currency
 *
 * @apiParamExample Request Example:
 *  {
 *    name: "Loan Something Something",
 *    maximum_loan_amount : 100000000000000000000000000000, // Very rich guy
 *    currency: "$"
 *  }
 *
 * @apiSuccess {String} _id loanProduct id
 * @apiSuccess {String} name LoanProduct Name
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
router.post('/create', acl(['*']), loanProductController.create);



/**
 * @api {get} /acat/loan-products/:id Get LoanProduct
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup LoanProduct
 *
 * @apiDescription Get a user loanProduct with the given id
 *
 * @apiSuccess {String} _id loanProduct id
 * @apiSuccess {String} name LoanProduct Name
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
router.get('/:id', acl(['*']), loanProductController.fetchOne);


/**
 * @api {put} /acat/loan-products/:id Update LoanProduct
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup LoanProduct 
 *
 * @apiDescription Update a LoanProduct loanProduct with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    name: "Crop Fertiliser and Chemicals Distribution "
 * }
 *
 * @apiSuccess {String} _id loanProduct id
 * @apiSuccess {String} name LoanProduct Name
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
router.put('/:id', acl(['*']), loanProductController.update);

/**
 * @api {get} /acat/loan-products/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get LoanProducts collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup LoanProduct
 *
 * @apiDescription Get a collection of loanProducts. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id loanProduct id
 * @apiSuccess {String} name LoanProduct Name
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
router.get('/paginate', acl(['*']), loanProductController.fetchAllByPagination);


// Expose LoanProduct Router
module.exports = router;