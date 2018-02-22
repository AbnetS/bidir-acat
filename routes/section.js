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
 * @apiParam {Array} [questions] Section Questions
 * @apiParam {String} form Form associated with section
 *
 * @apiParamExample Request Example:
 *  {
 *    title: "Crop Fertiliser Distribution ",
 *    questions : ["556e1174a8952c9521286a60"],
 *    form : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id section id
 * @apiSuccess {String} title Section Title
 * @apiSuccess {Array} questions Section Questions
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
 * @apiSuccess {Array} questions Section Questions
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
 * @apiSuccess {Array} questions Section Questions
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
 * @apiSuccess {Array} questions Section Questions
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
router.get('/paginate', acl(['*']), sectionController.fetchAllByPagination);


// Expose Section Router
module.exports = router;
