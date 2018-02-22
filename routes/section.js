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

/**
 * @api {post} /acat/sections/create Create new Section
 * @apiVersion 1.0.0
 * @apiName CreateSection
 * @apiGroup Section
 *
 * @apiDescription Create new Section. 
 *
 * @apiParam {String} title Section Title
 * @apiParam {String} number Section Numberr
 * @apiParam {String} [has_cost_list] If Section has Cost list
 * @apiParam {String} [parent_section] if Section is a sub section
 *
 * @apiParamExample Request Example:
 *  {
 *    title: "Fertiliser",
 *    has_cost_list : true,
 *    parent_section : "556e1174a8952c9521286a60",
 *    number : "1.1.2"
 *  }
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
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Fertiliser",
 *    number : "1.1.2",
 *    estimated_total:  100,
 *    achieved_sub_total : 97,
 *    sub_sections: [{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    },
 *    ...
 *  }
 *
 */
router.post('/create', acl(['*']), sectionController.create);



/**
 * @api {get} /acat/sections/:id Get Section Section
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Section
 *
 * @apiDescription Get a user section with the given id
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
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Fertiliser",
 *    number : "1.1.2",
 *    estimated_total:  100,
 *    achieved_sub_total : 97,
 *    sub_sections: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    },
 *    ...
 *  }
 *
 */
router.get('/:id', acl(['*']), sectionController.fetchOne);


/**
 * @api {put} /acat/sections/:id Update Section Section
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Section 
 *
 * @apiDescription Update a Section section with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    title: "Crop Fertiliser and Chemicals Distribution "
 * }
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
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Fertiliser",
 *    number : "1.1.2",
 *    estimated_total:  100,
 *    achieved_sub_total : 97,
 *    sub_sections: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    },
 *    ...
 *  }
 */
router.put('/:id', acl(['*']), sectionController.update);

/**
 * @api {get} /acat/sections/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get Sections collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Section
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
 *    "total_docs_count": 0,
 *    "docs": [{
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Fertiliser",
 *    number : "1.1.2",
 *    estimated_total:  100,
 *    achieved_sub_total : 97,
 *    sub_sections: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    },
 *    ...
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), sectionController.fetchAllByPagination);


// Expose Section Router
module.exports = router;
