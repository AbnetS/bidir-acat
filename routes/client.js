'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:acat-router');

const processorController  = require('../controllers/processor');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /acat/clients/initialize Initialize Client ACAT
 * @apiVersion 1.0.0
 * @apiName InitializeClientACAT
 * @apiGroup ClientACAT
 *
 * @apiDescription Initialize Client ACAT.
 *
 * @apiParam {String} client ACAT Title
 *
 * @apiParamExample Request Example:
 *  {
 *    client: "556e1174a8952c9521286a60",
 *  }
 *
 * @apiSuccess {String} _id Client ACAT  id
 * @apiSuccess {String} client Client Reference
 * @apiSuccess {String} branch Client Branch
 * @apiSuccess {Object} loan_product Loan Product Reference
 * @apiSuccess {Array} ACATs Crop ACATs
 * @apiSuccess {Number} total_cost Total Cost
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Number} total_revenue Total Revenue
 * @apiSuccess {Number} net_cash_flow Net Cash Flow
 * @apiSuccess {Number} cumulative_cash_flow Cumulative Cash Flow
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    branch : "556e1174a8952c9521286a60",
 *    loan_product : "556e1174a8952c9521286a60",
 *    ACATs: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }],
 *    created_by: "556e1174a8952c9521286a60",
 *    total_cost: 0,
 *    total_revenue: 0,
 *    cumulative_cash_flow: 0
 *  }
 *
 */
router.post('/initialize', acl(['*']), processorController.initialize);

/**
 * @api {post} /acat/clients/add Add Crop ACAT
 * @apiVersion 1.0.0
 * @apiName AddCropACAT
 * @apiGroup ClientACAT
 *
 * @apiDescription Add new crop ACAT for client
 *
 * @apiParam {String} client_acat Client ACAT Reference 
 * @apiParam {String} crop_acat Crop ACAT Reference
 *
 * @apiParamExample Request Example:
 *  {
 *    client_acat : "556e1174a8952c9521286a60",
 *    crop_acat : "556e1174a8952c9521286a60",
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
router.post('/add', acl(['*']), processorController.addACAT);


/**
 * @api {get} /acat/clients/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get processors collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup ClientACAT
 *
 * @apiDescription Get a collection of processors. The endpoint has pagination
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
router.get('/paginate', acl(['*']), processorController.fetchAllByPagination);

/**
 * @api {get} /acat/clients/:id Get Client ACAT
 * @apiVersion 1.0.0
 * @apiName GetClientACAT
 * @apiGroup ClientACAT
 *
 * @apiDescription Get a user processor with the given id
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
router.get('/:id', acl(['*']), processorController.fetchOne);


/**
 * @api {put} /acat/clients/:id Update ACAT 
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup ClientACAT 
 *
 * @apiDescription Update a ACAT processor with the given id
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
router.put('/:id', acl(['*']), processorController.update);

// Expose ACAT Router
module.exports = router;
