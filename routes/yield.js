'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:yield-router');

const yieldController  = require('../controllers/yield');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /acat/yields/create Create new Yield
 * @apiVersion 1.0.0
 * @apiName CreateYield
 * @apiGroup Yield
 *
 * @apiDescription Create new Yield. 
 *
 * @apiParam {String} title Yield Title
 * @apiParam {Array} [questions] Yield Questions
 * @apiParam {String} form Form associated with yield
 *
 * @apiParamExample Request Example:
 *  {
 *    title: "Crop Fertiliser Distribution ",
 *    questions : ["556e1174a8952c9521286a60"],
 *    form : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id yield id
 * @apiSuccess {String} title Yield Title
 * @apiSuccess {Array} questions Yield Questions
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser Distribution ",
 *    questions: [{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
 *  }
 *
 */
router.post('/create', acl(['*']), yieldController.create);



/**
 * @api {get} /acat/yields/:id Get Yield Yield
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Yield
 *
 * @apiDescription Get a user yield with the given id
 *
 * @apiSuccess {String} _id yield id
 * @apiSuccess {String} title Yield Title
 * @apiSuccess {Array} questions Yield Questions
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser Distribution ",
 *    questions: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
 *  }
 *
 */
router.get('/:id', acl(['*']), yieldController.fetchOne);


/**
 * @api {put} /acat/yields/:id Update Yield Yield
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Yield 
 *
 * @apiDescription Update a Yield yield with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    title: "Crop Fertiliser and Chemicals Distribution "
 * }
 *
 * @apiSuccess {String} _id yield id
 * @apiSuccess {String} title Yield Title
 * @apiSuccess {Array} questions Yield Questions
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser and Chemicals Distribution ",
 *    questions: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
 *  }
 */
router.put('/:id', acl(['*']), yieldController.update);

/**
 * @api {get} /acat/yields/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get Yields collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Yield
 *
 * @apiDescription Get a collection of yields. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id yield id
 * @apiSuccess {String} title Yield Title
 * @apiSuccess {Array} questions Yield Questions
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      _id : "556e1174a8952c9521286a60",
 *      title: "Crop Fertiliser and Chemicals Distribution ",
 *      questions: [{
 *        _id : "556e1174a8952c9521286a60",
 *        ....
 *      }]
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), yieldController.fetchAllByPagination);


// Expose Yield Router
module.exports = router;
