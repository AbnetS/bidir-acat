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
 * @api {post} /acat/loanProducts/create Create new LoanProduct
 * @apiVersion 1.0.0
 * @apiName CreateLoanProduct
 * @apiGroup LoanProduct
 *
 * @apiDescription Create a new LoanProduct. 
 *
 * @apiParam {String} name LoanProduct Name
 * @apiParam {String} maximum_loan_amount LoanProduct Maximum Loan Amount
 
 *
 * @apiParamExample Request Example:
 *  {
        "name":"Rain Fed Loan",
        "currency":"ETB",
        "maximum_loan_amount":"20000",
        "deductibles":[
            {
            "item":"Compulsory Saving",
            "percent":"5"
            },
            {
            "item":"Registration Fee",
            "fixed_amount":"250"
            }],
        "cost_of_loan":[
            {
            "item":"Interest",
            "percent":"10"
            
            }]
        ] 
 *  }
 *
 * @apiSuccess {String} _id loanProduct id
 * @apiSuccess {String} name LoanProduct Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {String} currency Currency
 * @apiSuccess {Object[]} deductibles Deductibles List
 * @apiSuccess {Object[]} cost_of_loan Cost of Loan 
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df35f365f7fc03e78ca44a2",
        "last_modified": "2019-12-13T09:51:50.737Z",
        "date_created": "2019-12-13T09:51:50.737Z",
        "created_by": "5b925494b1cfc10001d80908",
        "layout": "TWO_COLUMNS",
        "cost_of_loan": [
            {
                "_id": "5df35f365f7fc03e78ca44a3",
                "item": "Interest",
                "percent": 10,
                "fixed_amount": 0
            }
        ],
        "deductibles": [
            {
                "_id": "5df35f365f7fc03e78ca44a5",
                "item": "Compulsory Saving",
                "percent": 5,
                "fixed_amount": 0
            },
            {
                "_id": "5df35f365f7fc03e78ca44a4",
                "item": "Registration Fee",
                "percent": 0,
                "fixed_amount": 250
            }
        ],
        "maximum_loan_amount": 20000,
        "currency": "ETB",
        "purpose": "",
        "name": "Rain Fed Loan"
 *  }
 *
 */
router.post('/create', acl(['*']), loanProductController.create);



/**
 * @api {get} /acat/loanProducts/:id Get Loan Product
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup LoanProduct
 *
 * @apiDescription Get a loanProduct with the given id
 *
 * @apiSuccess {String} _id loanProduct id
 * @apiSuccess {String} name LoanProduct Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {String} currency Currency
 * @apiSuccess {Object[]} deductibles Deductibles List
 * @apiSuccess {Object[]} cost_of_loan Cost of Loan 
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df35f365f7fc03e78ca44a2",
        "last_modified": "2019-12-13T09:51:50.737Z",
        "date_created": "2019-12-13T09:51:50.737Z",
        "created_by": "5b925494b1cfc10001d80908",
        "layout": "TWO_COLUMNS",
        "cost_of_loan": [
            {
                "_id": "5df35f365f7fc03e78ca44a3",
                "item": "Interest",
                "percent": 10,
                "fixed_amount": 0
            }
        ],
        "deductibles": [
            {
                "_id": "5df35f365f7fc03e78ca44a5",
                "item": "Compulsory Saving",
                "percent": 5,
                "fixed_amount": 0
            },
            {
                "_id": "5df35f365f7fc03e78ca44a4",
                "item": "Registration Fee",
                "percent": 0,
                "fixed_amount": 250
            }
        ],
        "maximum_loan_amount": 20000,
        "currency": "ETB",
        "purpose": "",
        "name": "Rain Fed Loan"
    }
 
 *  
 *
 */
router.get('/:id', acl(['*']), loanProductController.fetchOne);


/**
 * @api {put} /acat/loanProducts/:id Update Loan Product
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup LoanProduct 
 *
 * @apiDescription Update a loanProduct with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    name: "Rainfed loan"
 * }
 *
 * @apiSuccess {String} _id loanProduct id
 * @apiSuccess {String} name LoanProduct Name
 * @apiSuccess {String} maximum_loan_amount Maximum Loan Amount
 * @apiSuccess {String} currency Currency
 * @apiSuccess {Object[]} deductibles Deductibles List
 * @apiSuccess {Object[]} cost_of_loan Cost of Loan 
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df35f365f7fc03e78ca44a2",
        "last_modified": "2019-12-13T09:51:50.737Z",
        "date_created": "2019-12-13T09:51:50.737Z",
        "created_by": "5b925494b1cfc10001d80908",
        "layout": "TWO_COLUMNS",
        "cost_of_loan": [
            {
                "_id": "5df35f365f7fc03e78ca44a3",
                "item": "Interest",
                "percent": 10,
                "fixed_amount": 0
            }
        ],
        "deductibles": [
            {
                "_id": "5df35f365f7fc03e78ca44a5",
                "item": "Compulsory Saving",
                "percent": 5,
                "fixed_amount": 0
            },
            {
                "_id": "5df35f365f7fc03e78ca44a4",
                "item": "Registration Fee",
                "percent": 0,
                "fixed_amount": 250
            }
        ],
        "maximum_loan_amount": 20000,
        "currency": "ETB",
        "purpose": "",
        "name": "Rainfed Loan"
    
 *  }
 */
router.put('/:id', acl(['*']), loanProductController.update);

/**
 * @api {get} /acat/loanProducts/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get LoanProducts collection
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
 * @apiSuccess {String} currency Currency
 * @apiSuccess {Object[]} deductibles Deductibles List
 * @apiSuccess {Object[]} cost_of_loan Cost of Loan 
 * @apiSuccess {String} created_by User registering this
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 1,
        "total_docs_count": 2,
        "current_page": 1,
        "docs": [
            {
                "_id": "5df35f365f7fc03e78ca44a2",
                ...
            },
            {
                ...
            }
        ]
 *  }
 */
router.get('/paginate', acl(['*']), loanProductController.fetchAllByPagination);


// Expose LoanProduct Router
module.exports = router;