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
 * @api {post} /acat/clients/initialize Initialize ACAT Application
 * @apiVersion 1.0.0
 * @apiName InitializeClientACAT
 * @apiGroup Client ACAT Application
 *
 * @apiDescription Initialize Client ACAT application
 *
 * @apiParam {String} client Client ID for which the ACAT application is going to be created/initialized
 * @apiParam {String[]} crop_acats Reference Crop ACAT Forms to indicate which crops the clients wants to cultivate
 * @apiParam {String} loan_product Loan Product Reference
 *
 * @apiParamExample Request Example:
 *  {
        "client": "5bd057573620aa0001c26c21",
        "loan_product": "5b92856fac942500011c111f",
        "crop_acats": ["5c02551002ff5a00012e815f"]
 *  }
 *
 * @apiSuccess {String} _id Client ACAT  id
 * @apiSuccess {String} client Client Reference
 * @apiSuccess {String} branch Client Branch
 * @apiSuccess {Object} loan_product Loan Product Reference
 * @apiSuccess {Array} ACATs Crop ACATs
 * @apiSuccess {Boolean} for_group If the client ACAT Application belongs to a client in a group
 * @apiSuccess {Object} created_by User registering this
 * @apiSuccess {String} status Status of the client ACAT
 * @apiSuccess {Object} estimated Aggregated estimated values of the client ACAT application
 * @apiSuccess {Number} estimated.total_cost Estimated total cost of client ACAT application
 * @apiSuccess {Number} estimated.total_revenue Estimated total revenue of client ACAT application
 * @apiSuccess {Number} estimated.net_income Estimated net income of client ACAT application
 * @apiSuccess {object} estimated.net_cash_flow Estimated net cash flow of client ACAT application
 * @apiSuccess {Object} achieved Aggregated achieved values of the client ACAT application
 * @apiSuccess {Number} achieved.total_cost Achieved total cost of client ACAT application
 * @apiSuccess {Number} achieved.total_revenue Achieved total revenue of client ACAT application
 * @apiSuccess {Number} achieved.net_income Achieved net income of client ACAT application
 * @apiSuccess {object} achieved.net_cash_flow Achieved net cash flow of client ACAT application
 * @apiSuccess {String} comment Comment
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df34c1544c3a500015799e5",
        "last_modified": "2019-12-13T08:30:14.330Z",
        "date_created": "2019-12-13T08:30:13.629Z",
        "client": {
            "_id": "5bd057573620aa0001c26c21",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "created_by": {
            "_id": "5ce0047a8958650001a8001a
            ...
        },
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
        "filling_status": "new",
        "status": "inprogress",
        "ACATs": [
            {
                "_id": "5df34c1544c3a500015799e6",
                ...
            },
            {
                ...
            }..
        ],
        "for_group": false,
        "loan_product": {
            "_id": "5b92856fac942500011c111f",
            ...
        }
 * }
 *
 */
router.post('/initialize', acl(['*']), processorController.initialize);

/**
 * @api {post} /acat/clients/add Add Crop ACAT to ACAT Application
 * @apiVersion 1.0.0
 * @apiName AddCropACAT
 * @apiGroup Client ACAT Application
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
 * @apiSuccess {String} _id Client ACAT  id
 * @apiSuccess {String} client Client Reference
 * @apiSuccess {String} branch Client Branch
 * @apiSuccess {Object} loan_product Loan Product Reference
 * @apiSuccess {Array} ACATs Crop ACATs
 * @apiSuccess {Boolean} for_group If the client ACAT Application belongs to a client in a group
 * @apiSuccess {Object} created_by User registering this
 * @apiSuccess {String} status Status of the client ACAT
 * @apiSuccess {Object} estimated Aggregated estimated values of the client ACAT application
 * @apiSuccess {Number} estimated.total_cost Estimated total cost of client ACAT application
 * @apiSuccess {Number} estimated.total_revenue Estimated total revenue of client ACAT application
 * @apiSuccess {Number} estimated.net_income Estimated net income of client ACAT application
 * @apiSuccess {object} estimated.net_cash_flow Estimated net cash flow of client ACAT application
 * @apiSuccess {Object} achieved Aggregated achieved values of the client ACAT application
 * @apiSuccess {Number} achieved.total_cost Achieved total cost of client ACAT application
 * @apiSuccess {Number} achieved.total_revenue Achieved total revenue of client ACAT application
 * @apiSuccess {Number} achieved.net_income Achieved net income of client ACAT application
 * @apiSuccess {object} achieved.net_cash_flow Achieved net cash flow of client ACAT application
 * @apiSuccess {String} comment Comment
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df34c1544c3a500015799e5",
        "last_modified": "2019-12-13T08:30:14.330Z",
        "date_created": "2019-12-13T08:30:13.629Z",
        "client": {
            "_id": "5bd057573620aa0001c26c21",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "created_by": {
            "_id": "5ce0047a8958650001a8001a
            ...
        },
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
        "filling_status": "new",
        "status": "inprogress",
        "ACATs": [
            {
                "_id": "5df34c1544c3a500015799e6",
                ...
            },
            {
                ...
            }..
        ],
        "for_group": false,
        "loan_product": {
            "_id": "5b92856fac942500011c111f",
            ...
        }
 *  }
 *
 */
router.post('/add', acl(['*']), processorController.addACAT);


/**
 * @api {get} /acat/clients/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get ACAT Applications Collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup Client ACAT Application
 *
 * @apiDescription Get a collection of processors. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id Client ACAT  id
 * @apiSuccess {String} client Client Reference
 * @apiSuccess {String} branch Client Branch
 * @apiSuccess {Object} loan_product Loan Product Reference
 * @apiSuccess {Array} ACATs Crop ACATs
 * @apiSuccess {Boolean} for_group If the client ACAT Application belongs to a client in a group
 * @apiSuccess {Object} created_by User registering this
 * @apiSuccess {String} status Status of the client ACAT
 * @apiSuccess {Object} estimated Aggregated estimated values of the client ACAT application
 * @apiSuccess {Number} estimated.total_cost Estimated total cost of client ACAT application
 * @apiSuccess {Number} estimated.total_revenue Estimated total revenue of client ACAT application
 * @apiSuccess {Number} estimated.net_income Estimated net income of client ACAT application
 * @apiSuccess {object} estimated.net_cash_flow Estimated net cash flow of client ACAT application
 * @apiSuccess {Object} achieved Aggregated achieved values of the client ACAT application
 * @apiSuccess {Number} achieved.total_cost Achieved total cost of client ACAT application
 * @apiSuccess {Number} achieved.total_revenue Achieved total revenue of client ACAT application
 * @apiSuccess {Number} achieved.net_income Achieved net income of client ACAT application
 * @apiSuccess {object} achieved.net_cash_flow Achieved net cash flow of client ACAT application
 * @apiSuccess {String} comment Comment
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 13,
        "total_docs_count": 128,
        "current_page": 1,
        "docs": [
            {
                "_id": "5de1802d5302990001f87180",
                ...
            },
            {
                ...
            }...
        ]
 *  }
 */
router.get('/paginate', acl(['*']), processorController.fetchAllByPagination);

/**
 * @api {get} /acat/clients/search?search=searchTerm&fields=field1,field2,..&page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Search ACAT Applications
 * @apiVersion 1.0.0
 * @apiName Search
 * @apiGroup Client ACAT Application
 *
 * @apiDescription Search For ACAT Clients. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 * 
 * @apiExample Usage Example:
 * api.test.bidir.gebeya.co/acat/clients/search?search=5b926c849fb7f20001f1494c&fields=client,branch,ACATs&per-page=100
 *
 * @apiSuccess {String} _id Client ACAT  id
 * @apiSuccess {String} client Client Reference
 * @apiSuccess {String} branch Client Branch
 * @apiSuccess {Object} loan_product Loan Product Reference
 * @apiSuccess {Array} ACATs Crop ACATs
 * @apiSuccess {Boolean} for_group If the client ACAT Application belongs to a client in a group
 * @apiSuccess {Object} created_by User registering this
 * @apiSuccess {String} status Status of the client ACAT
 * @apiSuccess {Object} estimated Aggregated estimated values of the client ACAT application
 * @apiSuccess {Number} estimated.total_cost Estimated total cost of client ACAT application
 * @apiSuccess {Number} estimated.total_revenue Estimated total revenue of client ACAT application
 * @apiSuccess {Number} estimated.net_income Estimated net income of client ACAT application
 * @apiSuccess {object} estimated.net_cash_flow Estimated net cash flow of client ACAT application
 * @apiSuccess {Object} achieved Aggregated achieved values of the client ACAT application
 * @apiSuccess {Number} achieved.total_cost Achieved total cost of client ACAT application
 * @apiSuccess {Number} achieved.total_revenue Achieved total revenue of client ACAT application
 * @apiSuccess {Number} achieved.net_income Achieved net income of client ACAT application
 * @apiSuccess {object} achieved.net_cash_flow Achieved net cash flow of client ACAT application
 * @apiSuccess {String} comment Comment
 *
 * @apiSuccessExample Response Example:
 *  {
        "total_pages": 13,
        "total_docs_count": 122,
        "current_page": 1,
        "docs": [
            {
                "_id": "5df34c1544c3a500015799e5",
                 "client": {
                    "_id": "5bd057573620aa0001c26c21",
                    ...
                 },
                "branch": {
                    "_id": "5b926c849fb7f20001f1494c",
                    ...
                 },
                "ACATs": [
                    {
                        "_id": "5df34c1544c3a500015799e6",
                        ...
                    },
                    {
                        ...
                    }
                ]
            },
            {
                "_id": "5dd5de579704b700014580b1",
                ...
            }...
        ]
 *  }
 */
router.get('/search', acl(['*']), processorController.search);


/**
 * @api {get} /acat/clients/:clientId Get ACAT Application
 * @apiVersion 1.0.0
 * @apiName GetClientACAT
 * @apiGroup Client ACAT Application
 *
 * @apiDescription Get client ACAT application with the given id
 *
 * @apiSuccess {String} _id Client ACAT  id
 * @apiSuccess {String} client Client Reference
 * @apiSuccess {String} branch Client Branch
 * @apiSuccess {Object} loan_product Loan Product Reference
 * @apiSuccess {Array} ACATs Crop ACATs
 * @apiSuccess {Boolean} for_group If the client ACAT Application belongs to a client in a group
 * @apiSuccess {Object} created_by User registering this
 * @apiSuccess {String} status Status of the client ACAT
 * @apiSuccess {Object} estimated Aggregated estimated values of the client ACAT application
 * @apiSuccess {Number} estimated.total_cost Estimated total cost of client ACAT application
 * @apiSuccess {Number} estimated.total_revenue Estimated total revenue of client ACAT application
 * @apiSuccess {Number} estimated.net_income Estimated net income of client ACAT application
 * @apiSuccess {object} estimated.net_cash_flow Estimated net cash flow of client ACAT application
 * @apiSuccess {Object} achieved Aggregated achieved values of the client ACAT application
 * @apiSuccess {Number} achieved.total_cost Achieved total cost of client ACAT application
 * @apiSuccess {Number} achieved.total_revenue Achieved total revenue of client ACAT application
 * @apiSuccess {Number} achieved.net_income Achieved net income of client ACAT application
 * @apiSuccess {object} achieved.net_cash_flow Achieved net cash flow of client ACAT application
 * @apiSuccess {String} comment Comment
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df34c1544c3a500015799e5",
        "last_modified": "2019-12-13T08:30:14.330Z",
        "date_created": "2019-12-13T08:30:13.629Z",
        "client": {
            "_id": "5bd057573620aa0001c26c21",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "created_by": {
            "_id": "5ce0047a8958650001a8001a
            ...
        },
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
        "filling_status": "new",
        "status": "inprogress",
        "ACATs": [
            {
                "_id": "5df34c1544c3a500015799e6",
                ...
            },
            {
                ...
            }..
        ],
        "for_group": false,
        "loan_product": {
            "_id": "5b92856fac942500011c111f",
            ...
        }
 *  }
 *
 */
router.get('/:id', acl(['*']), processorController.fetchOne);


/**
 * @api {put} /acat/clients/:id Update ACAT Application
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Client ACAT Application
 *
 * @apiDescription Update an ACAT application with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    status: "authorized"
 * }
 *
 * @apiSuccess {String} _id Client ACAT  id
 * @apiSuccess {String} client Client Reference
 * @apiSuccess {String} branch Client Branch
 * @apiSuccess {Object} loan_product Loan Product Reference
 * @apiSuccess {Array} ACATs Crop ACATs
 * @apiSuccess {Boolean} for_group If the client ACAT Application belongs to a client in a group
 * @apiSuccess {Object} created_by User registering this
 * @apiSuccess {String} status Status of the client ACAT
 * @apiSuccess {Object} estimated Aggregated estimated values of the client ACAT application
 * @apiSuccess {Number} estimated.total_cost Estimated total cost of client ACAT application
 * @apiSuccess {Number} estimated.total_revenue Estimated total revenue of client ACAT application
 * @apiSuccess {Number} estimated.net_income Estimated net income of client ACAT application
 * @apiSuccess {object} estimated.net_cash_flow Estimated net cash flow of client ACAT application
 * @apiSuccess {Object} achieved Aggregated achieved values of the client ACAT application
 * @apiSuccess {Number} achieved.total_cost Achieved total cost of client ACAT application
 * @apiSuccess {Number} achieved.total_revenue Achieved total revenue of client ACAT application
 * @apiSuccess {Number} achieved.net_income Achieved net income of client ACAT application
 * @apiSuccess {object} achieved.net_cash_flow Achieved net cash flow of client ACAT application
 * @apiSuccess {String} comment Comment
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df34c1544c3a500015799e5",
        "last_modified": "2019-12-13T08:30:14.330Z",
        "date_created": "2019-12-13T08:30:13.629Z",
        "client": {
            "_id": "5bd057573620aa0001c26c21",
            ...
        },
        "branch": {
            "_id": "5b926c849fb7f20001f1494c",
            ...
        },
        "created_by": {
            "_id": "5ce0047a8958650001a8001a
            ...
        },
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
        "filling_status": "new",
        "status": "authorized",
        "ACATs": [
            {
                "_id": "5df34c1544c3a500015799e6",
                ...
            },
            {
                ...
            }..
        ],
        "for_group": false,
        "loan_product": {
            "_id": "5b92856fac942500011c111f",
            ...
        }
 *  }
 */
router.put('/:id', acl(['*']), processorController.update);

// Expose ACAT Router
module.exports = router;
