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
 * @api {post} /acat/forms/initialize Initialize Skeleton ACAT
 * @apiVersion 1.0.0
 * @apiName InitializeACAT
 * @apiGroup ACAT
 *
 * @apiDescription Initialize skeleton ACAT With defaults. Use _MULTIPART/FORMDATA_
 *
 * @apiParam {String} [subtitle] ACAT Subtitle
 * @apiParam {String} [purpose] ACAT Purpose
 * @apiParam {String} title ACAT Title
 * @apiParam {String} crop ACAT Crop
 * @apiParam {String} crop_category ACAT Crop Category
 * @apiParam {Object} crop_image ACAT Crop Image
 *
 * @apiParamExample Request Example:
 *  {
 *    subtitle: "This is a subtitle",
 *    title: "ACAT Form",
 *    crop: "Maize",
 *    crop_category: "Grain"
 *    crop_image: "<IMAGE_OBJECT>"
 *  }
 *
 * @apiSuccess {String} _id ACAT form id
 * @apiSuccess {String} type Form Type ACAT
 * @apiSuccess {String} subtitle ACAT Form Subtitle
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} purpose ACAT Form Purpose
 * @apiSuccess {Array} sections ACAT Form sections
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} crop_category ACAT Crop Category
 * @apiSuccess {String} crop_image ACAT Crop Image
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "ACAT",
 *    crop: "Maize",
 *    crop_category: "Grain"
 *    crop_image: "https://fb.cdn.ugusgu.us./client/285475474224.png",
 *    description: "This is a Description",
 *    title: "ACAT Form",
 *    process: "",
 *    sections: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: "556e1174a8952c9521286a60",
 *    achieved: {
 *        net_cash_flow: 0,
 *        net_income: 0,
 *        total_revenue: 0,
 *        total_cost: 0
 *    },
 *    estimated: {
 *      net_cash_flow: 0,
 *      net_income: 0,
 *      total_revenue: 0,
 *      total_cost: 0
 *    }
 *  }
 *
 */
router.post('/initialize', acl(['*']), builderController.initialize);

/**
 * @api {post} /acat/forms/create Create new ACAT
 * @apiVersion 1.0.0
 * @apiName CreateACAT
 * @apiGroup ACAT
 *
 * @apiDescription Create new ACAT. Use _MULTIPART/FORMDATA_
 *
 * @apiParam {String} subtitle ACAT Subtitle
 * @apiParam {String} purpose ACAT Purpose
 * @apiParam {String} title ACAT Title
 * @apiParam {String} crop ACAT Crop
 * @apiParam {String} crop_category ACAT Crop Category
 * @apiParam {Object} crop_image ACAT Crop Image
 *
 * @apiParamExample Request Example:
 *  {
 *    description: "This is a Description",
 *    title: "ACAT Form",
 *    crop: "Maize",
 *    crop_category: "Grain"
 *    crop_image: "<IMAGE_OBJECT>"
 *  }
 *
 * @apiSuccess {String} _id ACAT form id
 * @apiSuccess {String} type Form Type ACAT
 * @apiSuccess {String} subtitle ACAT Form Subtitle
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} purpose ACAT Form Purpose
 * @apiSuccess {Array} sections ACAT Form sections
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} crop_category ACAT Crop Category
 * @apiSuccess {String} crop_image ACAT Crop Image
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "ACAT",
 *    crop: "Maize",
 *    description: "This is a Description",
 *    title: "ACAT Form",
 *    crop_category: "Grain"
 *    crop_image: "https://fb.cdn.ugusgu.us./client/285475474224.png",
 *    process: "",
 *    sections: [{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: "556e1174a8952c9521286a60",
 *    achieved: {
 *        net_cash_flow: 0,
 *        net_income: 0,
 *        total_revenue: 0,
 *        total_cost: 0
 *    },
 *    estimated: {
 *      net_cash_flow: 0,
 *      net_income: 0,
 *      total_revenue: 0,
 *      total_cost: 0
 *    }
 *  }
 *
 */
router.post('/create', acl(['*']), builderController.create);


/**
 * @api {get} /acat/forms/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get builders collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup ACAT
 *
 * @apiDescription Get a collection of builders. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id ACAT form id
 * @apiSuccess {String} type Form Type ACAT
 * @apiSuccess {String} subtitle ACAT Form Subtitle
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} purpose ACAT Form Purpose
 * @apiSuccess {Array} sections ACAT Form sections
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} crop_category ACAT Crop Category
 * @apiSuccess {String} crop_image ACAT Crop Image
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *        _id : "556e1174a8952c9521286a60",
 *        type: "ACAT",
 *        crop: "Maize",
 *        crop_category: "Grain",
 *        crop_image: "https://fb.cdn.ugusgu.us./client/285475474224.png",
 *        description: "This is a Description",
 *        title: "ACAT Form",
 *        process: "",
 *        sections: [{
 *            _id : "556e1174a8952c9521286a60",
 *            ....
 *        }],
 *        created_by: "556e1174a8952c9521286a60",
 *        achieved: {
 *            net_cash_flow: 0,
 *            net_income: 0,
 *            total_revenue: 0,
 *            total_cost: 0
 *        },
 *        estimated: {
 *            net_cash_flow: 0,
 *            net_income: 0,
 *            total_revenue: 0,
 *            total_cost: 0
 *        }
 *    }]
 *  }
 */
router.get('/paginate', acl(['*']), builderController.fetchAllByPagination);

/**
 * @api {get} /acat/forms/:id Get ACAT ACAT
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup ACAT
 *
 * @apiDescription Get a user builder with the given id
 *
 * @apiSuccess {String} _id ACAT form id
 * @apiSuccess {String} type Form Type ACAT
 * @apiSuccess {String} subtitle ACAT Form Subtitle
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} purpose ACAT Form Purpose
 * @apiSuccess {Array} sections ACAT Form sections
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} crop_category ACAT Crop Category
 * @apiSuccess {String} crop_image ACAT Crop Image
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "ACAT",
 *    crop: "Maize",
 *    crop_category: "Grain"
 *    crop_image: "https://fb.cdn.ugusgu.us./client/285475474224.png",
 *    description: "This is a Description",
 *    title: "ACAT Form",
 *    process: "",
 *    sections: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: "556e1174a8952c9521286a60",
 *    achieved: {
 *        net_cash_flow: 0,
 *        net_income: 0,
 *        total_revenue: 0,
 *        total_cost: 0
 *    },
 *    estimated: {
 *      net_cash_flow: 0,
 *      net_income: 0,
 *      total_revenue: 0,
 *      total_cost: 0
 *    }
 *  }
 *
 */
router.get('/:id', acl(['*']), builderController.fetchOne);


/**
 * @api {put} /acat/forms/:id Update ACAT 
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
 * @apiSuccess {String} _id ACAT form id
 * @apiSuccess {String} type Form Type ACAT
 * @apiSuccess {String} subtitle ACAT Form Subtitle
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} purpose ACAT Form Purpose
 * @apiSuccess {Array} sections ACAT Form sections
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} crop_category ACAT Crop Category
 * @apiSuccess {String} crop_image ACAT Crop Image
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    type: "ACAT",
 *    crop: "Maize",
 *    crop_category: "Grain"
 *    crop_image: "https://fb.cdn.ugusgu.us./client/285475474224.png",
 *    description: "This is a Description",
 *    title: "ACAT Form",
 *    process: "",
 *    sections: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: "556e1174a8952c9521286a60",
 *    achieved: {
 *        net_cash_flow: 0,
 *        net_income: 0,
 *        total_revenue: 0,
 *        total_cost: 0
 *    },
 *    estimated: {
 *      net_cash_flow: 0,
 *      net_income: 0,
 *      total_revenue: 0,
 *      total_cost: 0
 *    }
 *  }
 */
router.put('/:id', acl(['*']), builderController.update);

// Expose ACAT Router
module.exports = router;
