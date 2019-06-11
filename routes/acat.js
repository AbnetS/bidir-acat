'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:acat-router');

const acatController  = require('../controllers/acat');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();


/**
 * @api {get} /acat/search?<QUERY_FIELD>=<QUERY_VALUE>&fields=<Fields> Search acats
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup ACAT
 *
 * @apiDescription Search a collection of acats. The endpoint has pagination
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
router.get('/search', acl(['*']), acatController.search);


/**
 * @api {get} /acat/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get acats collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup ACAT
 *
 * @apiDescription Get a collection of acats. The endpoint has pagination
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
router.get('/paginate', acl(['*']), acatController.fetchAllByPagination);

/**
 * @api {get} /acat/client/:id Get client acats
 * @apiVersion 1.0.0
 * @apiName GetClientACATs
 * @apiGroup ACAT
 *
 * @apiDescription Get a collection of acats for a given client
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
 *  [{
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
 */
router.get('/client/:id', acl(['*']), acatController.getClientACATs);

/**
 * @api {put} /acat/:id/geolocation Update ACAT Geoloction
 * @apiVersion 1.0.0
 * @apiName UpdateGeolocation
 * @apiGroup ACAT 
 *
 * @apiDescription Update a ACAT Geolocation with the given id
 *
 * @apiParam {String} type Coordinates Type __single_point__ or __polygon__
 * @apiParam {Number} longitude Longitude
 * @apiParam {Number} latitude Latitude
 *
 * @apiParamExample Request example:
 * {
 *    type: "single_point",
 *    latitude: 1.346677
 *    longitude; 45.688454
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
 *
 */
router.put('/:id/geolocation', acl(['*']), acatController.updateGeolocation);

/**
 * @api {get} /acat/:id Get ACAT 
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup ACAT
 *
 * @apiDescription Get a user acat with the given id
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
router.get('/:id', acl(['*']), acatController.fetchOne);

router.get('/printout/:id', acl(['*']), acatController.generatePrintOut);


/**
 * @api {put} /acat/:id Update ACAT 
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup ACAT 
 *
 * @apiDescription Update a ACAT acat with the given id
 *
 * @apiParam {Object} Data Update data
  * @apiParam {Boolean} [is_client_acat] If section belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 *
 * @apiParamExample Request example:
 * {
 *    title: "MFI ACAT Title",
 *    is_client_acat: true,
 *    client_acat: "556e1174a8952c9521286a60"
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
router.put('/:id', acl(['*']), acatController.update);

// Expose ACAT Router
module.exports = router;
