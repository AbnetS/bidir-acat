'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:yieldConsumption-router');

const yieldConsumptionController  = require('../controllers/yieldConsumption');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();


/**
 * @api {get} /acat/yieldConsumptions/:id Get YieldConsumption 
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup YieldConsumption
 *
 * @apiDescription Get a user yieldConsumption with the given id
 *
 * @apiSuccess {String} _id yieldConsumption id
 * @apiSuccess {String} remark YieldConsumption Remark
 * @apiSuccess {Object} achieved Achieved 
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id": "5ad9b5bed2c0811d228d710a",
 *    "last_modified": "2018-04-23T19:05:16.297Z",
 *    "date_created": "2018-04-20T09:41:18.879Z",
 *    "remark": "",
 *     "achieved": {
 *         "market_details": [
 *             {
 *               "to_whom": "Tony Mutai",
 *               "amount": 102
 *           }
 *        ],
 *         "for_market": 0,
 *         "seed_reserve": 0,
 *         "own_consumption": 0
 *     },
 *     "estimated": {
 *         "market_details": [],
 *         "for_market": 0,
 *         "seed_reserve": 0,
 *         "own_consumption": 0
 *     }
 *  }
 *
 */
router.get('/:id', acl(['*']), yieldConsumptionController.fetchOne);


/**
 * @api {put} /acat/yieldConsumptions/:id Update YieldConsumption YieldConsumption
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup YieldConsumption 
 *
 * @apiDescription Update a YieldConsumption yieldConsumption with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    remark: "Crop Fertiliser and Chemicals Distribution "
 * }
 *
  * @apiSuccess {String} _id yieldConsumption id
 * @apiSuccess {String} remark YieldConsumption Remark
 * @apiSuccess {Object} achieved Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id": "5ad9b5bed2c0811d228d710a",
 *    "last_modified": "2018-04-23T19:05:16.297Z",
 *    "date_created": "2018-04-20T09:41:18.879Z",
 *    "remark": "Crop Fertiliser and Chemicals Distribution",
 *     "achieved": {
 *         "market_details": [
 *             {
 *               "to_whom": "Tony Mutai",
 *               "amount": 102
 *           }
 *        ],
 *         "for_market": 0,
 *         "seed_reserve": 0,
 *         "own_consumption": 0
 *     },
 *     "estimated": {
 *         "market_details": [],
 *         "for_market": 0,
 *         "seed_reserve": 0,
 *         "own_consumption": 0
 *     }
 *  }
 */
router.put('/:id', acl(['*']), yieldConsumptionController.update);

/**
 * @api {get} /acat/yieldConsumptions/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get YieldConsumptions collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup YieldConsumption
 *
 * @apiDescription Get a collection of yieldConsumptions. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
  * @apiSuccess {String} _id yieldConsumption id
 * @apiSuccess {String} remark YieldConsumption Remark
 * @apiSuccess {Object} achieved Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *    "_id": "5ad9b5bed2c0811d228d710a",
 *    "last_modified": "2018-04-23T19:05:16.297Z",
 *    "date_created": "2018-04-20T09:41:18.879Z",
 *    "remark": "Crop Fertiliser and Chemicals Distribution",
 *     "achieved": {
 *         "market_details": [
 *             {
 *               "to_whom": "Tony Mutai",
 *               "amount": 102
 *           }
 *        ],
 *         "for_market": 0,
 *         "seed_reserve": 0,
 *         "own_consumption": 0
 *     },
 *     "estimated": {
 *         "market_details": [],
 *         "for_market": 0,
 *         "seed_reserve": 0,
 *         "own_consumption": 0
 *     }
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), yieldConsumptionController.fetchAllByPagination);


// Expose YieldConsumption Router
module.exports = router;