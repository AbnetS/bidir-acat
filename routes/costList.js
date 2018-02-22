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

// Expose CostList Router
module.exports = router;
