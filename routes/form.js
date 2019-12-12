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
 * @apiName InitializeACATForm
 * @apiGroup ACAT Form
 *
 * @apiDescription Initialize skeleton ACAT With default sections. Use _MULTIPART/FORMDATA_
 *
 * @apiParam {String} [subtitle] ACAT Subtitle
 * @apiParam {String} [purpose] ACAT Purpose
 * @apiParam {String} title ACAT Form Title
 * @apiParam {String} crop crop Id for the ACAT form is created for
 
 *
 * @apiParamExample Request Example:
 *  {
        "title": "Wheat-CAT",
        "crop":"5df1f6f54e45714abc2e7f3d"
 *  }
 *
 * @apiSuccess {String} _id ACAT form id
 * @apiSuccess {String} type Form Type ACAT
 * @apiSuccess {String} title ACAT Form Title
 * @apiSuccess {String} subtitle ACAT Form Subtitle 
 * @apiSuccess {String} purpose ACAT Form Purpose 
 * @apiSuccess {String} layout ACAT Form Layout ie TWO_COLUMNS or THREE_COLUMNS 
 * @apiSuccess {Object[]} sections ACAT Form sections
 * @apiSuccess {String} created_by Officer Account registering this
 * @apiSuccess {String} crop ACAT Crop
 * @apiSuccess {String} cropping_area_size Returned as 0, applicable for ACAT Applications of clients
 * @apiSuccess {String} access_to_non_financial_resources Returned as false(default value), applicable only for ACAT Applications of clients
 * @apiSuccess {String[]} non_financial_resources Returned as empty array, applicable only for ACAT Applications of clients
 * @apiSuccess {String} first_expense_month Returned as 'None', applicable only for ACAT Applications of clients
 * @apiSuccess {Object} estimated Estimated ACAT Values
 * @apiSuccess {Object} achieved Estimated ACAT Achieved
 *
 * 
 * @apiSuccessExample Response Example:
 *  {
 
    "_id": "5df201381cd19659c8f6a0a4",
    "last_modified": "2019-12-12T08:58:33.071Z",
    "date_created": "2019-12-12T08:58:32.318Z",
    "crop": {
        "_id": "5df1f6f54e45714abc2e7f3d",
        "last_modified": "2019-12-12T08:14:45.354Z",
        "date_created": "2019-12-12T08:14:45.354Z",
        "has_acat": false,
        "category": "Grain",
        "image": "http://api.dev.bidir.gebeya.co/assets/WHEAT_0cca13d5c9cc.jpg",
        "name": "Wheat"
    },
    "type": "ACAT",
    "created_by": "5b925494b1cfc10001d80908",
    "achieved": {
        "net_cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            "sep": 0,
            "aug": 0,
            "july": 0,
            "june": 0,
            "may": 0,
            "apr": 0,
            "mar": 0,
            "feb": 0,
            "jan": 0
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
            "sep": 0,
            "aug": 0,
            "july": 0,
            "june": 0,
            "may": 0,
            "apr": 0,
            "mar": 0,
            "feb": 0,
            "jan": 0
        },
        "net_income": 0,
        "total_revenue": 0,
        "total_cost": 0
    },
    "first_expense_month": "None",
    "non_financial_resources": [],
    "access_to_non_financial_resources": false,
    "cropping_area_size": "0",
    "sections": [
        {
            "_id": "5df201381cd19659c8f6a0a5",
            "last_modified": "2019-12-12T08:58:33.046Z",
            "date_created": "2019-12-12T08:58:32.957Z",
            "estimated_sub_total": 0,
            "achieved_sub_total": 0,
            "estimated_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                "sep": 0,
                "aug": 0,
                "july": 0,
                "june": 0,
                "may": 0,
                "apr": 0,
                "mar": 0,
                "feb": 0,
                "jan": 0
            },
            "achieved_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                "sep": 0,
                "aug": 0,
                "july": 0,
                "june": 0,
                "may": 0,
                "apr": 0,
                "mar": 0,
                "feb": 0,
                "jan": 0
            },
            "number": 1,
            "sub_sections": [
                {
                    "_id": "5df201391cd19659c8f6a0ac",
                    "last_modified": "2019-12-12T08:58:33.015Z",
                    "date_created": "2019-12-12T08:58:33.015Z",
                    "estimated_sub_total": 0,
                    "achieved_sub_total": 0,
                    "estimated_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "achieved_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "number": 1,
                    "sub_sections": [
                        {
                            "_id": "5df201381cd19659c8f6a0a7",
                            "last_modified": "2019-12-12T08:58:32.984Z",
                            "date_created": "2019-12-12T08:58:32.984Z",
                            "variety": "",
                            "seed_source": [],
                            "estimated_sub_total": 0,
                            "achieved_sub_total": 0,
                            "estimated_cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "achieved_cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "cost_list": {
                                "_id": "5df201381cd19659c8f6a0a6",
                                "last_modified": "2019-12-12T08:58:32.979Z",
                                "date_created": "2019-12-12T08:58:32.979Z",
                                "grouped": [],
                                "linear": []
                            },
                            "number": 1,
                            "sub_sections": [],
                            "title": "Seed"
                        },
                        {
                            "_id": "5df201381cd19659c8f6a0a9",
                            "last_modified": "2019-12-12T08:58:32.996Z",
                            "date_created": "2019-12-12T08:58:32.996Z",
                            "estimated_sub_total": 0,
                            "achieved_sub_total": 0,
                            "estimated_cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "achieved_cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "cost_list": {
                                "_id": "5df201381cd19659c8f6a0a8",
                                "last_modified": "2019-12-12T08:58:32.991Z",
                                "date_created": "2019-12-12T08:58:32.991Z",
                                "grouped": [],
                                "linear": []
                            },
                            "number": 2,
                            "sub_sections": [],
                            "title": "Fertilizers"
                        },
                        {
                            "_id": "5df201391cd19659c8f6a0ab",
                            "last_modified": "2019-12-12T08:58:33.008Z",
                            "date_created": "2019-12-12T08:58:33.008Z",
                            "estimated_sub_total": 0,
                            "achieved_sub_total": 0,
                            "estimated_cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "achieved_cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "cost_list": {
                                "_id": "5df201391cd19659c8f6a0aa",
                                "last_modified": "2019-12-12T08:58:33.004Z",
                                "date_created": "2019-12-12T08:58:33.004Z",
                                "grouped": [],
                                "linear": []
                            },
                            "number": 3,
                            "sub_sections": [],
                            "title": "Chemicals"
                        }
                    ],
                    "title": "Input"
                },
                {
                    "_id": "5df201391cd19659c8f6a0ae",
                    "last_modified": "2019-12-12T08:58:33.030Z",
                    "date_created": "2019-12-12T08:58:33.030Z",
                    "cost_list": {
                        "_id": "5df201391cd19659c8f6a0ad",
                        "last_modified": "2019-12-12T08:58:33.026Z",
                        "date_created": "2019-12-12T08:58:33.026Z",
                        "grouped": [],
                        "linear": []
                    },
                    "estimated_sub_total": 0,
                    "achieved_sub_total": 0,
                    "estimated_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "achieved_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "number": 2,
                    "sub_sections": [],
                    "title": "Labour Cost"
                },
                {
                    "_id": "5df201391cd19659c8f6a0b0",
                    "last_modified": "2019-12-12T08:58:33.041Z",
                    "date_created": "2019-12-12T08:58:33.041Z",
                    "estimated_sub_total": 0,
                    "achieved_sub_total": 0,
                    "estimated_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "achieved_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "cost_list": {
                        "_id": "5df201391cd19659c8f6a0af",
                        "last_modified": "2019-12-12T08:58:33.038Z",
                        "date_created": "2019-12-12T08:58:33.038Z",
                        "grouped": [],
                        "linear": []
                    },
                    "number": 3,
                    "sub_sections": [],
                    "title": "Other Costs"
                }
            ],
            "title": "Inputs And Activity Costs"
        },
        {
            "_id": "5df201391cd19659c8f6a0b1",
            "last_modified": "2019-12-12T08:58:33.146Z",
            "date_created": "2019-12-12T08:58:33.066Z",
            "estimated_min_revenue": 0,
            "estimated_max_revenue": 0,
            "estimated_probable_revenue": 0,
            "achieved_revenue": 0,
            "estimated_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                "sep": 0,
                "aug": 0,
                "july": 0,
                "june": 0,
                "may": 0,
                "apr": 0,
                "mar": 0,
                "feb": 0,
                "jan": 0
            },
            "achieved_cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                "sep": 0,
                "aug": 0,
                "july": 0,
                "june": 0,
                "may": 0,
                "apr": 0,
                "mar": 0,
                "feb": 0,
                "jan": 0
            },
            "number": 2,
            "sub_sections": [
                {
                    "_id": "5df201391cd19659c8f6a0b4",
                    "last_modified": "2019-12-12T08:58:33.109Z",
                    "date_created": "2019-12-12T08:58:33.109Z",
                    "estimated_sub_total": 0,
                    "achieved_sub_total": 0,
                    "estimated_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "achieved_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "yield": {
                        "_id": "5df201391cd19659c8f6a0b3",
                        "last_modified": "2019-12-12T08:58:33.102Z",
                        "date_created": "2019-12-12T08:58:33.102Z",
                        "achieved": {
                            "cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "total_price": 0,
                            "unit_price": 0,
                            "value": 0
                        },
                        "estimated": {
                            "cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "total_price": 0,
                            "unit_price": 0,
                            "value": 0
                        },
                        "remark": "",
                        "unit": "",
                        "item": "",
                        "number": 0
                    },
                    "yield_consumption": {
                        "_id": "5df201391cd19659c8f6a0b2",
                        "last_modified": "2019-12-12T08:58:33.095Z",
                        "date_created": "2019-12-12T08:58:33.095Z",
                        "remark": "",
                        "achieved": {
                            "market_details": [],
                            "for_market": 0,
                            "seed_reserve": 0,
                            "own_consumption": 0
                        },
                        "estimated": {
                            "market_details": [],
                            "for_market": 0,
                            "seed_reserve": 0,
                            "own_consumption": 0
                        }
                    },
                    "number": 1,
                    "sub_sections": [],
                    "title": "Probable Yield"
                },
                {
                    "_id": "5df201391cd19659c8f6a0b6",
                    "last_modified": "2019-12-12T08:58:33.126Z",
                    "date_created": "2019-12-12T08:58:33.126Z",
                    "estimated_sub_total": 0,
                    "achieved_sub_total": 0,
                    "estimated_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "achieved_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "yield": {
                        "_id": "5df201391cd19659c8f6a0b5",
                        "last_modified": "2019-12-12T08:58:33.120Z",
                        "date_created": "2019-12-12T08:58:33.120Z",
                        "achieved": {
                            "cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "total_price": 0,
                            "unit_price": 0,
                            "value": 0
                        },
                        "estimated": {
                            "cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "total_price": 0,
                            "unit_price": 0,
                            "value": 0
                        },
                        "remark": "",
                        "unit": "",
                        "item": "",
                        "number": 0
                    },
                    "number": 2,
                    "sub_sections": [],
                    "title": "Maximum Yield"
                },
                {
                    "_id": "5df201391cd19659c8f6a0b8",
                    "last_modified": "2019-12-12T08:58:33.139Z",
                    "date_created": "2019-12-12T08:58:33.139Z",
                    "estimated_sub_total": 0,
                    "achieved_sub_total": 0,
                    "estimated_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "achieved_cash_flow": {
                        "dec": 0,
                        "nov": 0,
                        "oct": 0,
                        "sep": 0,
                        "aug": 0,
                        "july": 0,
                        "june": 0,
                        "may": 0,
                        "apr": 0,
                        "mar": 0,
                        "feb": 0,
                        "jan": 0
                    },
                    "yield": {
                        "_id": "5df201391cd19659c8f6a0b7",
                        "last_modified": "2019-12-12T08:58:33.134Z",
                        "date_created": "2019-12-12T08:58:33.134Z",
                        "achieved": {
                            "cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "total_price": 0,
                            "unit_price": 0,
                            "value": 0
                        },
                        "estimated": {
                            "cash_flow": {
                                "dec": 0,
                                "nov": 0,
                                "oct": 0,
                                "sep": 0,
                                "aug": 0,
                                "july": 0,
                                "june": 0,
                                "may": 0,
                                "apr": 0,
                                "mar": 0,
                                "feb": 0,
                                "jan": 0
                            },
                            "total_price": 0,
                            "unit_price": 0,
                            "value": 0
                        },
                        "remark": "",
                        "unit": "",
                        "item": "",
                        "number": 0
                    },
                    "number": 3,
                    "sub_sections": [],
                    "title": "Minimum Yield"
                }
            ],
            "title": "Revenue"
        }
    ],
    "layout": "TWO_COLUMNS",
    "purpose": "",
    "subtitle": "",
    "title": "Wheat-CAT"
}
 *
 */
router.post('/initialize', acl(['*']), builderController.initialize);

/**
 * @api {post} /acat/forms/create Create new ACAT form
 * @apiVersion 1.0.0
 * @apiName CreateACATForm
 * @apiGroup ACAT Form
 *
 * @apiDescription Create new ACAT Fomr. 
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

/**
 * @api {delete} /acat/forms/:id Delete ACAT 
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup ACAT 
 *
 * @apiDescription Delete a ACAT builder with the given id
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
router.delete('/:id', acl(['*']), builderController.remove);

// Expose ACAT Router
module.exports = router;
