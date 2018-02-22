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
 * @api {post} /acat/costLists/add Add new CostList
 * @apiVersion 1.0.0
 * @apiName AddCostList
 * @apiGroup CostList
 *
 * @apiDescription Create new CostList. 
 *
 * @apiParam {String} title CostList Title
 * @apiParam {Array} [questions] CostList Questions
 * @apiParam {String} form Form associated with costList
 *
 * @apiParamExample Request Example:
 *  {
 *    title: "Crop Fertiliser Distribution ",
 *    questions : ["556e1174a8952c9521286a60"],
 *    form : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id costList id
 * @apiSuccess {String} title CostList Title
 * @apiSuccess {Array} questions CostList Questions
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser Distribution ",
 *    questions: [{
 *		 _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
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
 *    title: "Crop Fertiliser and Chemicals Distribution "
 * }
 *
 * @apiSuccess {String} _id costList id
 * @apiSuccess {String} title CostList Title
 * @apiSuccess {Array} questions CostList Questions
 * @apiSuccess {String} number Question Order number
 *
 * @apiSuccessExample Response Example:
 *  {
 *    _id : "556e1174a8952c9521286a60",
 *    title: "Crop Fertiliser and Chemicals Distribution ",
 *    questions: [{
 *     _id : "556e1174a8952c9521286a60",
 *       ....
 *    }]
 *  }
 */
router.put('/:id', acl(['*']), costListController.update);

// Expose CostList Router
module.exports = router;
