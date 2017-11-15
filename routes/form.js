'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:form-router');

const formController  = require('../controllers/form');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /forms/create Create new Form
 * @apiVersion 1.0.0
 * @apiName CreateForm
 * @apiGroup Form
 *
 * @apiDescription Create new Form. 
 *
 * @apiParam {String} type Form Type ie Screening or Form Application
 * @apiParam {String} description Form Description
 * @apiParam {String} title Form Title
 * @apiParam {String} process Form Process
 * @apiParam {Array} questions Form Questions
 * @apiParam {String} created_by Officer Account registering this
 *
 * @apiParamExample Request Example:
 *  {
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "Form Title",
 *    process: "",
 *    questions : ["556e1174a8952c9521286a60"],
 *    created_by : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie Screening or Form Application
 * @apiSuccess {String} description Form Description
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} process Form Process
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} created_by Officer Account registering this
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "Form Title",
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
router.post('/create', acl(['*']), formController.create);


/**
 * @api {get} /forms/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get forms collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Form
 *
 * @apiDescription Get a collection of forms. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie Screening or Form Application
 * @apiSuccess {String} description Form Description
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} process Form Process
 * @apiSuccess {Array} questions Form Questions
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
 *    title: "Form Title",
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
router.get('/paginate', acl(['*']), formController.fetchAllByPagination);

/**
 * @api {get} /forms/:id Get Form Form
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Form
 *
 * @apiDescription Get a user form with the given id
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie Screening or Form Application
 * @apiSuccess {String} description Form Description
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} process Form Process
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} created_by Officer Account registering this
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "Form Title",
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
router.get('/:id', acl(['*']), formController.fetchOne);


/**
 * @api {put} /forms/:id Update Form Form
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Form 
 *
 * @apiDescription Update a Form form with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    title: "MFI Form Title"
 * }
 *
 * @apiSuccess {String} _id form id
 * @apiSuccess {String} type Form Type ie Screening or Form Application
 * @apiSuccess {String} description Form Description
 * @apiSuccess {String} title Form Title
 * @apiSuccess {String} process Form Process
 * @apiSuccess {Array} questions Form Questions
 * @apiSuccess {String} created_by Officer Account registering this
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "Screening",
 *    description: "This is a Description",
 *    title: "MFI Form Title",
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
router.put('/:id', acl(['*']), formController.update);

// Expose Form Router
module.exports = router;
