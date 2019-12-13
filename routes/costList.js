'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:costList-router');

const costListController  = require('../controllers/costList');
const authController     = require('../controllers/auth');

const acl               = authController.accessControl;
var router  = Router();

/**
 * @api {post} /acat/costLists/add Add CostList Item
 * @apiVersion 1.0.0
 * @apiName AddCostList
 * @apiGroup CostList
 *
 * @apiDescription This endpoint can be used for three purposes.
 *                 1. Create a costList Item, and add it to a linear list under the respective parent cost list
 *                 2. Create a cost list item, and add it to a grouped list under the respective parent cost list
 *                 3. Create an empty grouped list under the respective parent cost list.
 *                 Note that a cost list has the following structure:
 *                 "cost_list": {
                        "_id": "5df201391cd19659c8f6a0af",
                        "last_modified": "2019-12-12T08:58:33.038Z",
                        "date_created": "2019-12-12T08:58:33.038Z",
                        "grouped": [],
                        "linear": []
                    }
 *
 * @apiParam {Number} [number] Serial number for the cost list item
 * @apiParam {String} type Linear or Grouped
 * @apiParam {String} item Name of the item
 * @apiParam {String} [unit] Unit of measurement
 * @apiParam {String} [remark] Remark
 * @apiParam {String} parent_cost_list If adding to Parent CostList Reference
 * @apiParam {String} parent_grouped_list If adding to Parent Grouped CostList Reference
 * @apiParam {String} yield_section If adding to Yield Section Reference
 *                    Only one of "parent_cost_list", "parent_grouped_list", "yield_section" should be provided.
 *
 * @apiParamExample Request Example: /EXAMPLE 1: To add a cost list item to a LINEAR COST LIST under the indicated parent cost list
 *  {
        "number":"1",
        "type":"linear",
        "parent_cost_list": "5df201381cd19659c8f6a0a6",
        "item":"Amount of required seed",
        "unit":"kg"
 *  }

 * @apiSuccessExample Response Example for EXAMPLE 1/returns the newly created cost list item/:
 {
     "_id": "5df335dc7d7475287029ff8d",
    "last_modified": "2019-12-13T06:55:24.473Z",
    "date_created": "2019-12-13T06:55:24.473Z",
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
    "item": "Size",
    "number": 2
 }

  @apiParamExample Request Example: /EXAMPLE 2: To add a grouped list (NOT COST LIST ITEM) under the indicated parent cost list
 *  {
        "type": "grouped",
        "parent_cost_list": "5df201391cd19659c8f6a0aa",
        "title": "Insecticide"
 *  }

 * @apiSuccessExample Response Example for EXAMPLE 2/returns the newly created grouped list/:
    {
        "_id": "5df336267d7475287029ff8f",
        "last_modified": "2019-12-13T06:56:38.547Z",
        "date_created": "2019-12-13T06:56:38.547Z",
        "title": "Insecticide",
        "items": []
    }

 

* @apiParamExample Request Example: /EXAMPLE 3: To add a cost list item to a GROUPED COST LIST under the indicated parent cost list

    {
        "parent_grouped_list": "5df336267d7475287029ff8f",
        "number":"1",
        "item": "Phostoxin",
        "unit":"Packet"
    }

* @apiSuccessExample Response Example for EXAMPLE 3/returns the newly created cost list item/:
    {
        "_id": "5df3373a7d7475287029ff90",
    "last_modified": "2019-12-13T07:01:14.059Z",
    "date_created": "2019-12-13T07:01:14.059Z",
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
    "unit": "Packet",
    "item": "Phostoxin",
    "number": 1

    }


 *
 */
router.post('/add', acl(['*']), costListController.addItem);

 

/**
 * @api {put} /acat/costLists/:id/reset Reset Cost List
 * @apiVersion 1.0.0
 * @apiName ResetCostList
 * @apiGroup CostList 
 *
 * @apiDescription Reset the cost list by removing all cost items in it (clears all items from linear/grouped lists).
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} linear Item Name
 * @apiSuccess {String} grouped Item Unit 
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df201381cd19659c8f6a0a6",
        "last_modified": "2019-12-12T12:07:26.753Z",
        "date_created": "2019-12-12T08:58:32.979Z",
        "grouped": [],
        "linear": []
 *  }
 */
router.put('/:id/reset', acl(['*']), costListController.reset);


/**
 * @api {put} /acat/costLists/:parentCostListId/linear Remove Cost List Item From Linear List
 * @apiVersion 1.0.0
 * @apiName RemoveCostListFromLinear
 * @apiGroup CostList 
 *
 * @apiDescription Remove Cost List Item from a linear list under the given parent cost list
 *
 * @apiParam {String} item_id Cost list Item Reference
 * @apiParam {Boolean} [is_client_acat] If item belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 *
 * @apiExample Usage Example
 * api.test.bidir.gebeya.co/acat/costLists/5df201381cd19659c8f6a0a6/linear
 
 * @apiParamExample Request example:
 * {
 *    "item_id":"5df335dc7d7475287029ff8d"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {Number} number Serial number
 * @apiSuccess {String} item Name of the item
 * @apiSuccess {String} unit Unit of measurement
 * @apiSuccess {String} remark Remark
 * @apiSuccess {Object} estimated Estimated Values
 * @apiSuccess {Object} achieved Achieved Values 
 *
 * @apiSuccessExample Response Example:
 {
    "_id": "5df335dc7d7475287029ff8d",
    "last_modified": "2019-12-13T06:55:24.473Z",
    "date_created": "2019-12-13T06:55:24.473Z",
    "achieved": {
        "cash_flow": {
            "dec": 0,
            "nov": 0,
            "oct": 0,
            ...
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
            ...
        },
        "total_price": 0,
        "unit_price": 0,
        "value": 0
    },
    "remark": "",
    "unit": "",
    "item": "Size",
    "number": 2
}
 */
router.put('/:id/linear', acl(['*']), costListController.removeLinear);

/**
 * @api {put} /acat/costLists/:parentCostListId/group Remove Grouped List 
 * @apiVersion 1.0.0
 * @apiName RemoveGroupedList
 * @apiGroup CostList 
 *
 * @apiDescription Remove a grouped list under the given parent cost list
 *
 * @apiParam {String} item_id Grouped List Id reference
 * @apiParam {Boolean} [is_client_acat] If grouped list belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 * 
 * @apiExample Usage Example
 * api.test.bidir.gebeya.co/acat/costLists/5df201391cd19659c8f6a0aa/group
 *
 * @apiParamExample Request example:
 * {
 *    item_id: "5df336267d7475287029ff8f"
 * }
 *
 * @apiSuccess {String} _id grouped list Id
 * @apiSuccess {String} title Title of the grouped list 
 * @apiSuccess {Object[]} items List of cost list items inside the group, which are also removed as a result
 *
 * @apiSuccessExample Response Example /returns the removed grouped list/:
 *  {
        "_id": "5df336267d7475287029ff8f",
        "last_modified": "2019-12-13T07:01:14.064Z",
        "date_created": "2019-12-13T06:56:38.547Z",
        "title": "Insecticide",
        "items": [
            "5df3373a7d7475287029ff90"
        ]
 *  }
 */
router.put('/:id/group', acl(['*']), costListController.removeGrouped);

/**
 * @api {put} /acat/costLists/groups/:groupedListId/items Remove Item From Grouped List
 * @apiVersion 1.0.0
 * @apiName RemoveCostListItemFromGroupedList
 * @apiGroup CostList 
 *
 * @apiDescription Remove a cost list Item from grouped list referenced the request url
 *
 * @apiParam {String} item_id Cost list Item Reference
 * @apiParam {Boolean} [is_client_acat] If cost list item belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 *
 * @apiParamExample Request example:
 * {
 *    item_id: "556e1174a8952c9521286a60"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {Number} number Serial number
 * @apiSuccess {String} item Name of the item
 * @apiSuccess {String} unit Unit of measurement
 * @apiSuccess {String} remark Remark
 * @apiSuccess {Object} estimated Estimated Values
 * @apiSuccess {Object} achieved Achieved Values 
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3414b0ded5023d0ce363f",
        "last_modified": "2019-12-13T07:44:11.046Z",
        "date_created": "2019-12-13T07:44:11.046Z",
        "achieved": {
            "cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
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
                ...
            },
            "total_price": 0,
            "unit_price": 0,
            "value": 0
        },
        "remark": "",
        "unit": "Packet",
        "item": "Phostoxin",
        "number": 1
 *  }
 */
router.put('/groups/:id/items', acl(['*']), costListController.removeGroupedItem);

/**
 * @api {put} /acat/costLists/grouped/:groupedListId Update Grouped List
 * @apiVersion 1.0.0
 * @apiName UpdateGroupedList
 * @apiGroup CostList 
 *
 * @apiDescription Update Grouped List
 *
 * @apiParam {String} title Grouped List Title
 * @apiParam {Boolean} [is_client_acat] If section belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 *
 * @apiParamExample Request example:
 * {
 *    title: "another title"
 * }
 *
  * @apiSuccess {String} _id grouped list Id
 * @apiSuccess {String} title Title of the grouped list 
 * @apiSuccess {Object[]} items List of cost list items inside the group
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Another Title",
 *    items: [...]
 *  }
 */
router.put('/grouped/:id', acl(['*']), costListController.updateGroupedList);


/**
 * @api {put} /acat/costLists/:costListItemId Update CostList Item
 * @apiVersion 1.0.0
 * @apiName UpdateCostListItem
 * @apiGroup CostList 
 *
 * @apiDescription Update a costList item with the given id
 *
 * @apiParam {Object} Data Update data
 * @apiParam {Boolean} [is_client_acat] If cost list item belongs to a client acat and not acat form
 * @apiParam {String} [client_acat] Client ACAT Reference
 *
 * @apiParamExample Request example:
 * {
 *    "unit":"ml"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {Number} number Serial number
 * @apiSuccess {String} item Name of the item
 * @apiSuccess {String} unit Unit of measurement
 * @apiSuccess {String} remark Remark
 * @apiSuccess {Object} estimated Estimated Values
 * @apiSuccess {Object} achieved Achieved Values 
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3432ca3d6363508ab96f1",
        "last_modified": "2019-12-13T07:52:21.205Z",
        "date_created": "2019-12-13T07:52:12.140Z",
        "achieved": {
            "cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
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
                ...
            },
            "total_price": 0,
            "unit_price": 0,
            "value": 0
        },
        "remark": "",
        "unit": "ml",
        "item": "Size",
        "number": 2
 *  }
 */
router.put('/:id', acl(['*']), costListController.update);


/**
 * @api {get} /acat/costLists/:id Get CostList Item
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup CostList 
 *
 * @apiDescription get a CostList item with the given id
 *
* @apiSuccess {String} _id costList Item id
 * @apiSuccess {Number} number Serial number
 * @apiSuccess {String} item Name of the item
 * @apiSuccess {String} unit Unit of measurement
 * @apiSuccess {String} remark Remark
 * @apiSuccess {Object} estimated Estimated Values
 * @apiSuccess {Object} achieved Achieved Values 
 *
 * @apiSuccessExample Response Example:
 *  {
        "_id": "5df3432ca3d6363508ab96f1",
        "last_modified": "2019-12-13T07:52:21.205Z",
        "date_created": "2019-12-13T07:52:12.140Z",
        "achieved": {
            "cash_flow": {
                "dec": 0,
                "nov": 0,
                "oct": 0,
                ...
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
                ...
            },
            "total_price": 0,
            "unit_price": 0,
            "value": 0
        },
        "remark": "",
        "unit": "ml",
        "item": "Size",
        "number": 2
 *  }
 */
router.get('/:id', acl(['*']), costListController.fetchOne);



// Expose CostList Router
module.exports = router;
