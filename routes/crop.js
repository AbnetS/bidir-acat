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
 *    name: "Wheat",
 *    category: "Grain"
 *    image: "<IMAGE_OBJECT>"
 *  }
 *
 * @apiSuccess {String} _id Crop id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 * @apiSuccess {Boolean} has_acat True/False to indicate if the crop has an A-CAT form
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df1f6f54e45714abc2e7f3d",
        "last_modified": "2019-12-12T08:14:45.354Z",
        "date_created": "2019-12-12T08:14:45.354Z",
        "has_acat": false,
        "category": "Grain",
        "image": "http://api.dev.bidir.gebeya.co/assets/WHEAT_0cca13d5c9cc.jpg",
        "name": "Wheat"
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
 * @apiSuccess {String} _id Crop id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 * @apiSuccess {Boolean} has_acat True/False to indicate if the crop has an A-CAT form
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 1,
        "total_docs_count": 10,
        "current_page": 1,
        "docs": [
            {
                "_id": "5df1f72a4e45714abc2e7f3e",
                ...
            },
            {
                ...
            }
        ]
 *  }
 */
router.get('/paginate', acl(['*']), cropController.fetchAllByPagination);

/**
 * @api {get} /acat/crops/:id Get Crop
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Crop
 *
 * @apiDescription Get a crop with the given id
 *
 * @apiSuccess {String} _id Crop id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 * @apiSuccess {Boolean} has_acat True/False to indicate if the crop has an A-CAT form
 *
 * @apiSuccessExample Response Example:
  *  {
        "_id": "5df1f6f54e45714abc2e7f3d",
        "last_modified": "2019-12-12T08:14:45.354Z",
        "date_created": "2019-12-12T08:14:45.354Z",
        "has_acat": false,
        "category": "Grain",
        "image": "http://api.dev.bidir.gebeya.co/assets/WHEAT_0cca13d5c9cc.jpg",
        "name": "Wheat"
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
 * @apiDescription Update a Crop with the given id
 *
 * @apiParam {Object} Data Update data, can be submitted as _MULTIPART/FORMDATA_
 *
 * @apiParamExample Request example:
 * {
 *    category: "Cereal",
 *    image: <IMAGE>
 * }
 *
 * @apiSuccess {String} _id Crop id
 * @apiSuccess {String} name Crop Name
 * @apiSuccess {String} category Crop Category
 * @apiSuccess {String} image Crop Image
 * @apiSuccess {Boolean} has_acat True/False to indicate if the crop has an A-CAT form
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df1f5e96ac038585087fcc1",
        "last_modified": "2019-12-12T08:48:44.515Z",
        "date_created": "2019-12-12T08:10:17.184Z",
        "has_acat": false,
        "category": "Cereal",
        "image": "http://api.dev.bidir.gebeya.co/assets/MAIZE_962259e8af24.jpg",
        "name": "Maize"
 *  }
 */
router.put('/:id', acl(['*']), cropController.update);

// Expose Crop Router
module.exports = router;
