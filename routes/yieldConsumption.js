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
 * @apiDescription Get a yieldConsumption with the given id
 *
 * @apiSuccess {String} _id yieldConsumption id 
 * @apiSuccess {Object} estimated Estimated 
 * @apiSuccess {Number} estimated.own_consumption Estimated amount for own consumption
 * @apiSuccess {Number} estimated.seed_reserve Estimated amount for Seed reserve
 * @apiSuccess {Number} estimated.for_market Estimated amount for for_market
 * @apiSuccess {Object[]} estimated.market_details market details
 * @apiSuccess {Object} achieved Achieved 
 * @apiSuccess {Number} achieved.own_consumption Actual amount for own consumption
 * @apiSuccess {Number} achieved.seed_reserve Actual amount for Seed reserve
 * @apiSuccess {Number} estimated.for_market Actual amount for for_market
 * @apiSuccess {Object[]} achieved.market_details market details
 * @apiSuccess {String} remark YieldConsumption Remark
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5bd05c04017721000162be39",
        "last_modified": "2018-12-04T14:45:50.233Z",
        "date_created": "2018-10-24T11:48:20.736Z",
        "remark": "",
        "achieved": {
            "market_details": [],
            "for_market": 0,
            "seed_reserve": 0,
            "own_consumption": 0
        },
        "estimated": {
            "market_details": [],
            "for_market": 18984,
            "seed_reserve": 0,
            "own_consumption": 0
        }
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
        "estimated": {
                "market_details": [],
                "for_market": 200,
                "seed_reserve": 1,
                "own_consumption":5 
            }
 * }
 *
 * @apiSuccess {String} _id yieldConsumption id 
 * @apiSuccess {Object} estimated Estimated 
 * @apiSuccess {Number} estimated.own_consumption Estimated amount for own consumption
 * @apiSuccess {Number} estimated.seed_reserve Estimated amount for Seed reserve
 * @apiSuccess {Number} estimated.for_market Estimated amount for for_market
 * @apiSuccess {Object[]} estimated.market_details market details
 * @apiSuccess {Object} achieved Achieved 
 * @apiSuccess {Number} achieved.own_consumption Actual amount for own consumption
 * @apiSuccess {Number} achieved.seed_reserve Actual amount for Seed reserve
 * @apiSuccess {Number} estimated.for_market Actual amount for for_market
 * @apiSuccess {Object[]} achieved.market_details market details
 * @apiSuccess {String} remark YieldConsumption Remark
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5bd05c04017721000162be39",
        "last_modified": "2019-12-13T12:27:56.614Z",
        "date_created": "2018-10-24T11:48:20.736Z",
        "remark": "",
        "achieved": {
            "market_details": [],
            "for_market": 0,
            "seed_reserve": 0,
            "own_consumption": 0
        },
        "estimated": {
            "market_details": [],
            "for_market": 200,
            "seed_reserve": 1,
            "own_consumption": 5
        }
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
 * @apiSuccess {Object} estimated Estimated 
 * @apiSuccess {Number} estimated.own_consumption Estimated amount for own consumption
 * @apiSuccess {Number} estimated.seed_reserve Estimated amount for Seed reserve
 * @apiSuccess {Number} estimated.for_market Estimated amount for for_market
 * @apiSuccess {Object[]} estimated.market_details market details
 * @apiSuccess {Object} achieved Achieved 
 * @apiSuccess {Number} achieved.own_consumption Actual amount for own consumption
 * @apiSuccess {Number} achieved.seed_reserve Actual amount for Seed reserve
 * @apiSuccess {Number} estimated.for_market Actual amount for for_market
 * @apiSuccess {Object[]} achieved.market_details market details
 * @apiSuccess {String} remark YieldConsumption Remark
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 13,
        "total_docs_count": 128,
        "current_page": 1,
        "docs": [
            {
                "_id": "5df201391cd19659c8f6a0b2",
                ...
            },
            {
                ....
            }...
        ]
 *  }
 */
router.get('/paginate', acl(['*']), yieldConsumptionController.fetchAllByPagination);


// Expose YieldConsumption Router
module.exports = router;