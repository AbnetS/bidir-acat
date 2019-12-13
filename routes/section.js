'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:section-router');

const sectionController  = require('../controllers/section');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();


router.post('/create', acl(['*']), sectionController.create);



/**
 * @api {get} /acat/sections/:id Get ACAT Section
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup ACAT Section
 *
 * @apiDescription Get a section with the given id
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {String} number Section Number
 * @apiSuccess {Number} estimated_sub_total Estimated Total
 * @apiSuccess {Number} achieved_sub_total Achieved Sub Total * 
 * @apiSuccess {Object} estimated_cash_flow Aggregated cashflow of the section for estimated values
 * @apiSuccess {Object} achieved_cash_flow Aggregated cashflow of the section for achieved values
 * @apiSuccess {Number} estimated_min_revenue Estimated minimum revenue if applicable
 * @apiSuccess {Number} estimated_max_revenue Estimated maximum revenue if applicable
 * @apiSuccess {Number} estimated_probable_revenue: Estimated probable revenue if applicable
 * @apiSuccess {Object[]} sub_sections Sub Sections,if any
 * @apiSuccess {Object} [cost_list] Cost List, if any
 * @apiSuccess {String} [seed_source] Seed Source (SEED type only)
 * @apiSuccess {String} [variety] Seed Variety (SEED type only)
 * @apiSuccess {Object} [yield] Estimated yield Values(YIELD type only)
 * @apiSuccess {Object} [yield_consumption] Estimated consumption from the yield(YIELD type only)
 
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df201391cd19659c8f6a0ab",
        "last_modified": "2019-12-12T08:58:33.008Z",
        "date_created": "2019-12-12T08:58:33.008Z",
        "estimated_sub_total": 0,
        "achieved_sub_total": 0,
        "estimated_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "achieved_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "cost_list": {
            "_id": "5df201391cd19659c8f6a0aa",
            "last_modified": "2019-12-13T07:43:57.309Z",
            "date_created": "2019-12-12T08:58:33.004Z",
            "grouped": [
                {
                    "_id": "5df3413d0ded5023d0ce363e",
                    "last_modified": "2019-12-13T07:46:05.501Z",
                    "date_created": "2019-12-13T07:43:57.301Z",
                    "title": "Insecticide",
                    "items": []
                }
            ],
            "linear": []
        },
        "number": 3,
        "sub_sections": [],
        "title": "Chemicals"
 *  }
 *
 */
router.get('/:id', acl(['*']), sectionController.fetchOne);


/**
 * @api {put} /acat/sections/:id Update ACAT Section
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup ACAT Section 
 *
 * @apiDescription Update a Section with the given id
 *
 * @apiParam {Object} Data Update data
 * @apiParam {Boolean} [is_client_acat] If section belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 *
 * @apiParamExample Request example:
 * {
 *    title: "Crop Fertiliser and Chemicals Distribution",
 *    is_client_acat: true,
 *    client_acat: "556e1174a8952c9521286a60"
 * }
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {String} number Section Number
 * @apiSuccess {Number} estimated_sub_total Estimated Total
 * @apiSuccess {Number} achieved_sub_total Achieved Sub Total * 
 * @apiSuccess {Object} estimated_cash_flow Aggregated cashflow of the section for estimated values
 * @apiSuccess {Object} achieved_cash_flow Aggregated cashflow of the section for achieved values
 * @apiSuccess {Number} estimated_min_revenue Estimated minimum revenue if applicable
 * @apiSuccess {Number} estimated_max_revenue Estimated maximum revenue if applicable
 * @apiSuccess {Number} estimated_probable_revenue: Estimated probable revenue if applicable
 * @apiSuccess {Object[]} sub_sections Sub Sections,if any
 * @apiSuccess {Object} [cost_list] Cost List, if any
 * @apiSuccess {String} [seed_source] Seed Source (SEED type only)
 * @apiSuccess {String} [variety] Seed Variety (SEED type only)
 * @apiSuccess {Object} [yield] Estimated yield Values(YIELD type only)
 * @apiSuccess {Object} [yield_consumption] Estimated consumption from the yield(YIELD type only)
 
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df201391cd19659c8f6a0ab",
        "last_modified": "2019-12-12T08:58:33.008Z",
        "date_created": "2019-12-12T08:58:33.008Z",
        "estimated_sub_total": 0,
        "achieved_sub_total": 0,
        "estimated_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "achieved_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
        },
        "cost_list": {
            "_id": "5df201391cd19659c8f6a0aa",
            "last_modified": "2019-12-13T07:43:57.309Z",
            "date_created": "2019-12-12T08:58:33.004Z",
            "grouped": [
                {
                    "_id": "5df3413d0ded5023d0ce363e",
                    "last_modified": "2019-12-13T07:46:05.501Z",
                    "date_created": "2019-12-13T07:43:57.301Z",
                    "title": "Insecticide",
                    "items": []
                }
            ],
            "linear": []
        },
        "number": 3,
        "sub_sections": [],
        "title": "Crop Fertiliser and Chemicals Distribution"
 *  }
 */
router.put('/:id', acl(['*']), sectionController.update);

/**
 * @api {get} /acat/sections/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get Sections collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup ACAT Section
 *
 * @apiDescription Get a collection of sections. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {String} number Section Number
 * @apiSuccess {Number} estimated_total Estimated Total
 * @apiSuccess {Number} achieved_sub_total Achieved Sub Total
 * @apiSuccess {Object} cash_flow Cash Flow
 * @apiSuccess {Array} sub_sections Sub Sections
 * @apiSuccess {Object} [cost_list] Cost List
 * @apiSuccess {String} [seed_source] Seed Source (SEED type only)
 * @apiSuccess {String} [variety] Seed Variety (SEED type only)
 * @apiSuccess {Object} [estimated] Estimated Values(YIELD type only)
 * @apiSuccess {Object} [achieved] Achieved Values(YIELD type only)
 * @apiSuccess {Object} [marketable_yield] Marketable yield(YIELD type only)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 53,
 *    "docs": [{
    *      _id : "556e1174a8952c9521286a60",
    *      ...
 *      },
 *      {
 *          ...
 *      }
 
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), sectionController.fetchAllByPagination);


// Expose Section Router
module.exports = router;
