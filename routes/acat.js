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



router.get('/search', acl(['*']), acatController.search);


/**
 * @api {get} /acat/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get ACAT Instances collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup ACAT Instance
 *
 * @apiDescription Get a collection of acats. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id crop ACAT Id
 * @apiSuccess {String} type Form Type
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} subtitle ACAT Form Subtitle 
 * @apiSuccess {String} purpose ACAT Form Purpose 
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {Object} client Client
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Object[]} sections ACAT Form sections 
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} cropping_area_size Returned as 0, applicable for ACAT Applications of clients
 * @apiSuccess {String} access_to_non_financial_resources Returned as false(default value), applicable only for ACAT Applications of clients
 * @apiSuccess {String[]} non_financial_resources Returned as empty array, applicable only for ACAT Applications of clients
 * @apiSuccess {String} first_expense_month Returned as 'None', applicable only for ACAT Applications of clients
 * @apiSuccess {Object} gps_location GPS location of the farm on which the crop will be cultivated
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 14,
        "total_docs_count": 136,
        "current_page": 1,
        "docs": [
            {
                "_id": "5df34c1544c3a500015799e6",
                ...
            },
            {
                ...
            }...
        ]
 *  }
 */
router.get('/paginate', acl(['*']), acatController.fetchAllByPagination);


router.get('/client/:id', acl(['*']), acatController.getClientACATs);

/**
 * @api {put} /acat/:id/geolocation Update ACAT Geolocation
 * @apiVersion 1.0.0
 * @apiName UpdateGeolocation
 * @apiGroup ACAT Instance
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
 *    longitude: 45.688454
 * }
 *
 * @apiSuccess {String} _id crop ACAT Id
 * @apiSuccess {String} type Form Type
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} subtitle ACAT Form Subtitle 
 * @apiSuccess {String} purpose ACAT Form Purpose 
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {Object} client Client
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Object[]} sections ACAT Form sections 
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} cropping_area_size Returned as 0, applicable for ACAT Applications of clients
 * @apiSuccess {String} access_to_non_financial_resources Returned as false(default value), applicable only for ACAT Applications of clients
 * @apiSuccess {String[]} non_financial_resources Returned as empty array, applicable only for ACAT Applications of clients
 * @apiSuccess {String} first_expense_month Returned as 'None', applicable only for ACAT Applications of clients
 * @apiSuccess {Object} gps_location GPS location of the farm on which the crop will be cultivated
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df34c1544c3a500015799e6",
        "last_modified": "2019-12-13T08:30:14.236Z",
        "date_created": "2019-12-13T08:30:13.729Z",
        "type": "ACAT",
        "client": {
            "_id": "5bd057573620aa0001c26c21",
            ...
        },
        crop": {
            "_id": "5c02550102ff5a00012e815e",
            ...
        },
        "created_by": "5ce0047a8958650001a8001a",
        "comment": "",
        "achieved": {
            "net_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
            },
            "net_income": 0,
            "total_revenue": 0,
            "total_cost": 0
        },
        "estimated": {
            "net_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
            },
            "net_income": 0,
            "total_revenue": 0,
            "total_cost": 0
        },
        "status": "new",
        "gps_location": {
            "polygon": [],
            "single_point": {
                "status": "NO ATTEMPT",
                "S2_Id": "NULL",
                "latitude": 1.346677
                "longitude"; 45.688454
            }
        },
        "first_expense_month": "None",
        "non_financial_resources": [],
        "access_to_non_financial_resources": false,
        "cropping_area_size": "0x0",
        "sections": [
            {
                "_id": "5df34c1544c3a500015799e7",
                ...
            },
            {
                ...
            }
        ],
        "layout": "TWO_COLUMNS",
        "purpose": "",
        "subtitle": "",
        "title": "Cabbage-CAT"
 *  }
 *
 */
router.put('/:id/geolocation', acl(['*']), acatController.updateGeolocation);

/**
 * @api {get} /acat/:id Get an ACAT Instance
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup ACAT Instance
 *
 * @apiDescription Get an ACAT instance with the given id
 *
 * @apiSuccess {String} _id crop ACAT Id
 * @apiSuccess {String} type Form Type
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} subtitle ACAT Form Subtitle 
 * @apiSuccess {String} purpose ACAT Form Purpose 
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {Object} client Client
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Object[]} sections ACAT Form sections 
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} cropping_area_size Returned as 0, applicable for ACAT Applications of clients
 * @apiSuccess {String} access_to_non_financial_resources Returned as false(default value), applicable only for ACAT Applications of clients
 * @apiSuccess {String[]} non_financial_resources Returned as empty array, applicable only for ACAT Applications of clients
 * @apiSuccess {String} first_expense_month Returned as 'None', applicable only for ACAT Applications of clients
 * @apiSuccess {Object} gps_location GPS location of the farm on which the crop will be cultivated
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df34c1544c3a500015799e6",
        "last_modified": "2019-12-13T08:30:14.236Z",
        "date_created": "2019-12-13T08:30:13.729Z",
        "type": "ACAT",
        "client": {
            "_id": "5bd057573620aa0001c26c21",
            ...
        },
        crop": {
            "_id": "5c02550102ff5a00012e815e",
            ...
        },
        "created_by": "5ce0047a8958650001a8001a",
        "comment": "",
        "achieved": {
            "net_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
            },
            "net_income": 0,
            "total_revenue": 0,
            "total_cost": 0
        },
        "estimated": {
            "net_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
            },
            "net_income": 0,
            "total_revenue": 0,
            "total_cost": 0
        },
        "status": "new",
        "gps_location": {
            "polygon": [],
            "single_point": {
                "status": "NO ATTEMPT",
                "S2_Id": "NULL",
                "longitude": 0,
                "latitude": 0
            }
        },
        "first_expense_month": "None",
        "non_financial_resources": [],
        "access_to_non_financial_resources": false,
        "cropping_area_size": "0x0",
        "sections": [
            {
                "_id": "5df34c1544c3a500015799e7",
                ...
            },
            {
                ...
            }
        ],
        "layout": "TWO_COLUMNS",
        "purpose": "",
        "subtitle": "",
        "title": "Cabbage-CAT"
 *  }
 *
 */
router.get('/:id', acl(['*']), acatController.fetchOne);


/**
 * @api {put} /acat/:id Generate Printout for ACAT Instance
 * @apiVersion 1.0.0
 * @apiName GeneratePrintOut
 * @apiGroup ACAT Instance
 *
 * @apiDescription Generate Excel printout for ACAT Instance
 * 
 * @apiSuccess file Excel file whose content is the details of the ACAT Instance
 * 
 * 
 * */
router.get('/printout/:id', acl(['*']), acatController.generatePrintOut);


/**
 * @api {put} /acat/:id Update ACAT Instance
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup ACAT Instance
 *
 * @apiDescription Update an ACAT instance with the given id
 *
 * @apiParam {Object} Data Update data
 * @apiParam {Boolean} [is_client_acat] If ACAT instance belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 *
 * @apiParamExample Request example:
 * {
        "first_expense_month":"January"
 * }
 *
 * @apiSuccess {String} _id crop ACAT Id
 * @apiSuccess {String} type Form Type
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} subtitle ACAT Form Subtitle 
 * @apiSuccess {String} purpose ACAT Form Purpose 
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {Object} client Client
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {Object[]} sections ACAT Form sections 
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} cropping_area_size Returned as 0, applicable for ACAT Applications of clients
 * @apiSuccess {String} access_to_non_financial_resources Returned as false(default value), applicable only for ACAT Applications of clients
 * @apiSuccess {String[]} non_financial_resources Returned as empty array, applicable only for ACAT Applications of clients
 * @apiSuccess {String} first_expense_month Returned as 'None', applicable only for ACAT Applications of clients
 * @apiSuccess {Object} gps_location GPS location of the farm on which the crop will be cultivated
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df34c1544c3a500015799e6",
        "last_modified": "2019-12-13T08:30:14.236Z",
        "date_created": "2019-12-13T08:30:13.729Z",
        "type": "ACAT",
        "client": {
            "_id": "5bd057573620aa0001c26c21",
            ...
        },
        crop": {
            "_id": "5c02550102ff5a00012e815e",
            ...
        },
        "created_by": "5ce0047a8958650001a8001a",
        "comment": "",
        "achieved": {
            "net_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
            },
            "net_income": 0,
            "total_revenue": 0,
            "total_cost": 0
        },
        "estimated": {
            "net_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
            },
            "net_income": 0,
            "total_revenue": 0,
            "total_cost": 0
        },
        "status": "new",
        "gps_location": {
            "polygon": [],
            "single_point": {
                "status": "NO ATTEMPT",
                "S2_Id": "NULL",
                "longitude": 0,
                "latitude": 0
            }
        },
        "first_expense_month": "January",
        "non_financial_resources": [],
        "access_to_non_financial_resources": false,
        "cropping_area_size": "0x0",
        "sections": [
            {
                "_id": "5df34c1544c3a500015799e7",
                ...
            },
            {
                ...
            }
        ],
        "layout": "TWO_COLUMNS",
        "purpose": "",
        "subtitle": "",
        "title": "Cabbage-CAT"
 *  }
 *  }
 */
router.put('/:id', acl(['*']), acatController.update);

// Expose ACAT Router
module.exports = router;
