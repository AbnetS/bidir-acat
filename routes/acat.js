'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:acat-router');

const builderController  = require('../controllers/builder');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /acat/create Create new ACAT
 * @apiVersion 1.0.0
 * @apiName CreateACAT
 * @apiGroup ACAT
 *
 * @apiDescription Create new ACAT. 
 *
 * @apiParam {String} type ACAT Type ie Screening or ACAT Application
 * @apiParam {String} description ACAT Description
 * @apiParam {String} title ACAT Title
 * @apiParam {String} process ACAT Process
 * @apiParam {Array} questions ACAT Questions
 * @apiParam {String} created_by Officer Account registering this
 *
 * @apiParamExample Request Example:
 *  {
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "ACAT Title",
 *    process: "",
 *    questions : ["556e1174a8952c9521286a60"],
 *    created_by : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id builder id
 * @apiSuccess {String} type ACAT Type ie Screening or ACAT Application
 * @apiSuccess {String} description ACAT Description
 * @apiSuccess {String} title ACAT Title
 * @apiSuccess {String} process ACAT Process
 * @apiSuccess {Array} questions ACAT Questions
 * @apiSuccess {String} created_by Officer Account registering this
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "ACAT Title",
 *    process: "",
 *    questions: ]{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }
 *  }
 *
 */
router.post('/create', acl(['*']), builderController.create);


/**
 * @api {get} /acat/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get builders collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup ACAT
 *
 * @apiDescription Get a collection of builders. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id builder id
 * @apiSuccess {String} type ACAT Type ie Screening or ACAT Application
 * @apiSuccess {String} description ACAT Description
 * @apiSuccess {String} title ACAT Title
 * @apiSuccess {String} process ACAT Process
 * @apiSuccess {Array} questions ACAT Questions
 * @apiSuccess {String} created_by Officer Account registering this
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *    _id : "556e1174a8952c9521286a60",
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "ACAT Title",
 *    process: "",
 *    questions: ]{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), builderController.fetchAllByPagination);

/**
 * @api {get} /acat/:id Get ACAT ACAT
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup ACAT
 *
 * @apiDescription Get a user builder with the given id
 *
 * @apiSuccess {String} _id builder id
 * @apiSuccess {String} type ACAT Type ie Screening or ACAT Application
 * @apiSuccess {String} description ACAT Description
 * @apiSuccess {String} title ACAT Title
 * @apiSuccess {String} process ACAT Process
 * @apiSuccess {Array} questions ACAT Questions
 * @apiSuccess {String} created_by Officer Account registering this
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "ACAT Title",
 *    process: "",
 *    questions: ]{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }
 *  }
 *
 */
router.get('/:id', acl(['*']), builderController.fetchOne);


/**
 * @api {put} /acat/:id Update ACAT 
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup ACAT 
 *
 * @apiDescription Update a ACAT builder with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    title: "MFI ACAT Title"
 * }
 *
 * @apiSuccess {String} _id builder id
 * @apiSuccess {String} type ACAT Type ie Screening or ACAT Application
 * @apiSuccess {String} description ACAT Description
 * @apiSuccess {String} title ACAT Title
 * @apiSuccess {String} process ACAT Process
 * @apiSuccess {Array} questions ACAT Questions
 * @apiSuccess {String} created_by Officer Account registering this
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "MFI ACAT Title",
 *    process: "",
 *    questions: ]{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: {
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }
 *  }
 */
router.put('/:id', acl(['*']), builderController.update);

// Expose ACAT Router
module.exports = router;
