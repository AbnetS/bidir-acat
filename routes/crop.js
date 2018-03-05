'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:acat-router');

const cropController  = require('../controllers/crop');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /acat/crops/create Create new Crop
 * @apiVersion 1.0.0
 * @apiName CreateCrop
 * @apiGroup Crop
 *
 * @apiDescription Create new Crop. Use _MULTIPART/FORMDATA_
 *
 * @apiParam {String} name Crop Name
 * @apiParam {String} category Crop Category
 * @apiParam {String} [image] Crop Image
 *
 * @apiParamExample Request Example:
 *  {
 *    name: "Maize",
 *    category: "Grain"
 *    image: "<IMAGE_OBJECT>"
 *  }
 *
 * @apiSuccess {String} _id Crop form id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Maize",
 *    category: "Grain"
 *    image: "https://fb.cdn.ugusgu.us./client/285475474224.png"
 *  }
 *
 */
router.post('/create', acl(['*']), cropController.create);


/**
 * @api {get} /acat/crops/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get crops collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Crop
 *
 * @apiDescription Get a collection of crops. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id Crop form id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *        _id : "556e1174a8952c9521286a60",
 *        name: "Maize",
 *        category: "Grain"
 *        image: "https://fb.cdn.ugusgu.us./client/285475474224.png"
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), cropController.fetchAllByPagination);

/**
 * @api {get} /acat/crops/:id Get Crop Crop
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Crop
 *
 * @apiDescription Get a user crop with the given id
 *
 * @apiSuccess {String} _id Crop form id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Maize",
 *    category: "Grain"
 *    image: "https://fb.cdn.ugusgu.us./client/285475474224.png"
 *  }
 *
 */
router.get('/:id', acl(['*']), cropController.fetchOne);


/**
 * @api {put} /acat/crops/:id Update Crop 
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Crop 
 *
 * @apiDescription Update a Crop crop with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    title: "MFI Crop Title"
 * }
 *
 * @apiSuccess {String} _id Crop form id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    name: "Maize",
 *    category: "Grain"
 *    image: "https://fb.cdn.ugusgu.us./client/285475474224.png"
 *  }
 */
router.put('/:id', acl(['*']), cropController.update);

// Expose Crop Router
module.exports = router;
