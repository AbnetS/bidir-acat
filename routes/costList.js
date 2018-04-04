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
 * @api {post} /acat/costLists/add Add  CostList Item
 * @apiVersion 1.0.0
 * @apiName AddCostList
 * @apiGroup CostList
 *
 * @apiDescription Create new CostList Item. 
 *
 * @apiParam {String} type Linear or Grouped
 * @apiParam {String} [parent_cost_list] If adding to Parent CostList Reference
 * @apiParam {String} [parent_grouped_list] If adding to Parent Grouped CostList Reference
 *
 * @apiParamExample Request Example:
 *  {
 *    type: "linear",
 *    parent_cost_list : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    item: "Item",
 *    unit: "MM",
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
 *    },
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    }
 *  }
 *
 */
router.post('/add', acl(['*']), costListController.addItem);

/**
 * @api {put} /acat/costLists/:id/reset Reset Cost List
 * @apiVersion 1.0.0
 * @apiName ResetCostList
 * @apiGroup CostList 
 *
 * @apiDescription Reset the cost list
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    linear: [],
 *    grouped: []
 *  }
 */
router.put('/:id/reset', acl(['*']), costListController.reset);


/**
 * @api {put} /acat/costLists/:id/linear Remove Linear List
 * @apiVersion 1.0.0
 * @apiName RemoveLinearList
 * @apiGroup CostList 
 *
 * @apiDescription Remove Linear Item from the cost list
 *
 * @apiParam {String} item_id Linear Item Reference
 *
 * @apiParamExample Request example:
 * {
 *    item_id: "556e1174a8952c9521286a60"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    item: "Item",
 *    unit: "Millimeters",
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
 *    },
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    }
 *  }
 */
router.put('/:id/linear', acl(['*']), costListController.removeLinear);

/**
 * @api {put} /acat/costLists/:id/group Remove Grouped List
 * @apiVersion 1.0.0
 * @apiName RemoveGroupedList
 * @apiGroup CostList 
 *
 * @apiDescription Remove Grouped Item from the cost list
 *
 * @apiParam {String} item_id Grouped Item Reference
 *
 * @apiParamExample Request example:
 * {
 *    item_id: "556e1174a8952c9521286a60"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    item: "Item",
 *    unit: "Millimeters",
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
 *    },
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    }
 *  }
 */
router.put('/:id/group', acl(['*']), costListController.removeGrouped);

/**
 * @api {put} /acat/costLists/groups/:id/items Remove Grouped Items
 * @apiVersion 1.0.0
 * @apiName RemoveGroupedItem
 * @apiGroup CostList 
 *
 * @apiDescription Remove  Item from the grouped list
 *
 * @apiParam {String} item_id Grouped Item Reference
 *
 * @apiParamExample Request example:
 * {
 *    item_id: "556e1174a8952c9521286a60"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    item: "Item",
 *    unit: "Millimeters",
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
 *    },
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    }
 *  }
 */
router.put('/groups/:id/items', acl(['*']), costListController.removeGroupedItem);

/**
 * @api {put} /acat/costLists/grouped/:id Update Grouped List
 * @apiVersion 1.0.0
 * @apiName UpdateGroupedList
 * @apiGroup CostList 
 *
 * @apiDescription Update Grouped List
 *
 * @apiParam {String} title Grouped List Title
 *
 * @apiParamExample Request example:
 * {
 *    title: "another title"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
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
 * @api {put} /acat/costLists/:id Update CostList CostList
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup CostList 
 *
 * @apiDescription Update a CostList costList with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request example:
 * {
 *    unit: "Millimeters"
 * }
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    item: "Item",
 *    unit: "Millimeters",
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
 *    },
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    }
 *  }
 */
router.put('/:id', acl(['*']), costListController.update);


/**
 * @api {get} /acat/costLists/:id Get CostList
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup CostList 
 *
 * @apiDescription get a CostList with the given id
 *
 * @apiSuccess {String} _id costList Item id
 * @apiSuccess {String} item Item Name
 * @apiSuccess {String} unit Item Unit
 * @apiSuccess {Object} estimated Unit Estimated Values
 * @apiSuccess {Object} achieved Unit Achieved Values
 * @apiSuccess {Object} cash_flow Cash Flow Values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    item: "Item",
 *    unit: "Millimeters",
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
 *    },
 *    cash_flow: {
 *        jan: '',
 *        feb: '',
 *        mar: '',
 *        ...
 *    }
 *  }
 */
router.get('/:id', acl(['*']), costListController.fetchOne);



// Expose CostList Router
module.exports = router;
