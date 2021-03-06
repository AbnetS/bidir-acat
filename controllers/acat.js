'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');
const fs      = require('fs');
const XlsxTemplate = require('xlsx-template');


const debug       = require('debug')('api:acat-controller');
const moment      = require('moment');
const jsonStream  = require('streaming-json-stringify');
const _           = require('lodash');
const co          = require('co');
const del         = require('del');
const validator   = require('validator');
const request     = require('request-promise')
const isReachable = require ("is-reachable");

const config              = require('../config');
const CustomError         = require('../lib/custom-error');
const checkPermissions    = require('../lib/permissions');
const FORM                = require ('../lib/enums').FORM;
const DOC_GENERATOR      = require ('../lib/doc-generator');//CLASS
const XLSX_GENERATOR      = require ('../lib/xlsx-generator');//CLASS


const ACATForm       = require('../models/ACATForm');
const Section        = require('../models/ACATSection');
const ClientACAT     = require('../models/clientACAT');
const Client         = require('../models/client');
const LoanProposal   = require ('../models/loanProposal');

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const SectionDal       = require('../dal/ACATSection');
const CostListDal      = require('../dal/costList');
const ClientACATDal    = require('../dal/clientACAT');
const ClientDal        = require('../dal/client');
const ACATDal          = require('../dal/ACAT');
const TaskDal    = require('../dal/task');
const LoanProposalDal = require ('../dal/loanProposal');
const NotificationDal          = require('../dal/notification');

let hasPermission = checkPermissions.isPermitted('ACAT');

/**
 * Update a single client geolocation.
 *
 * @desc Fetch a client with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.updateGeolocation = function* updateGeolocation(next) {
  debug(`updating acat: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'ACAT_UPDATE_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

 
  this.checkBody('type')
      .notEmpty('GPS location type is Empty')
      .isIn(["single_point", "polygon"], "Correct types are single_point or polygon")

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'ACAT_UPDATE_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let acat = yield ACATDal.get(query);
    if(!acat) throw new Error('ACAT Does Not Exist!!');

    acat        = acat.toJSON();
    let geolocation = acat.gps_location;

    body.crop = acat.crop.name;

    // check for dups
    if (body.type === 'single_point') {
      let singlePointLocation = body.gps_location.single_point;
      let singlePoint = geolocation.single_point;
      geolocation.polygon = [];

      if (!(singlePoint.latitude === singlePointLocation.latitude &&
          singlePoint.longitude === singlePointLocation.longitude &&  (singlePoint.S2_Id !== "NULL"))){    
          let isWpsAvailable = yield isReachable(config.S2.URL);  
          if (isWpsAvailable)  { 
            let s2Res = yield sendToS2(singlePointLocation);
            let gps_registered = false;

            singlePointLocation.s2 = s2Res

            try {
              s2Res = JSON.parse(s2Res)
            } catch(ex) {
              //
              s2Res = null;
            }

            if (!s2Res) {
              geolocation.single_point = {
                longitude: singlePointLocation.longitude,
                latitude: singlePointLocation.latitude,
                status: "DECLINED"
              }
            } else {
              gps_registered = true;
              geolocation.single_point = {
                longitude: singlePointLocation.longitude,
                latitude: singlePointLocation.latitude,
                status: "ACCEPTED",
                S2_Id: s2Res.field_id
              }
            }
          }
          else {
            geolocation.single_point = {
              longitude: singlePointLocation.longitude,
              latitude: singlePointLocation.latitude,
              status: "NO ATTEMPT"
            }

          }        
      } 
    } else if (body.type === 'polygon') {
      let polygonLocations = body.gps_location.polygon;
      let polygon = geolocation.polygon;
      geolocation.single_point = {};
      geolocation.polygon = [];

      for (let loc of polygonLocations){
        let isRegistered = polygon.some(function iter(coord) {
          return (coord.latitude === loc.latitude && coord.longitude === loc.longitude && coord.S2_Id != "NULL")
        });

        if (!isRegistered){
          let isWpsAvailable = yield isReachable(config.S2.URL);  
          if (isWpsAvailable){
            let s2Res = yield sendToS2(loc);
            let gps_registered = false;

            loc.s2 = s2Res

            try {
              s2Res = JSON.parse(s2Res)
            } catch(ex) {
              //
              s2Res = null;
            }

            if (!s2Res) {
              loc.status = "ACCEPTED"; loc.S2_Id = s2Res.field_id
            } else {loc.status = "DECLINED"}

            geolocation.polygon.push(loc)
          
            gps_registered = true;
          } else{
            loc.S2_Id = "NULL";
            loc.status = "NO ATTEMPT";
            geolocation.polygon.push(loc)

          }
        }
      }
    }

    yield LogDal.track({
      event: 'acat_update',
      client: this.state._user._id ,
      message: `Update Info for ${acat._id}`,
      diff: body
    });

    acat = yield ACATDal.update({
      _id: acat._id
    }, {
      gps_location: geolocation,
      //gps_registered: gps_registered
    })

    acat = acat.toJSON()

    acat.client = acat.client._id;

    this.body = acat;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: ex.message
    }));

  }

};



/**
 * Get a single acat.
 *
 * @desc Fetch a acat with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneACAT(next) {
  debug(`fetch acat: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };

  try {
    let ACAT = yield ACATDal.get(query);
    if(!ACAT) throw new Error('ACAT Does Not Exist');

    yield LogDal.track({
      event: 'view_ACAT',
      user: this.state._user._id ,
      message: `View ACAT - ${ACAT.title}`
    });

    this.body = ACAT;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_ERROR',
      message: ex.message
    }));
  }

};


exports.generatePrintOut = function* generatePrintOutForACAT(next) {
  debug(`fetch acat: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };

  try {
    let ACAT = yield ACATDal.get(query);
    if(!ACAT) throw new Error('ACAT Does Not Exist');

    yield LogDal.track({
      event: 'view_ACAT',
      user: this.state._user._id ,
      message: `View ACAT - ${ACAT.title}`
    });

    let data = ACAT._doc;

    let clientACAT = yield ClientACATDal.get({"ACATs":{$in:[this.params.id]}});

    let loanProposal = yield LoanProposal.findOne({client_acat: clientACAT._id})
      .sort({ date_created: -1 })
      .exec();
    if (loanProposal._doc){
      data.loan_proposal = loanProposal._doc;
      //Compute the deductibles and cost of loan for reporting purpose
      data.deductibles = [];
      for (let ded of data.loan_proposal.loan_detail.deductibles){
        if (ded.fixed_amount!=0){
          ded.value = ded.fixed_amount;
        } else {
          ded.value = (ded.percent/100) * data.loan_proposal.loan_proposed;
        }
        ded.currency = "Birr";
        ded.placeholder = "";
        data.deductibles.push (ded);
      }

      data.cost_of_loan = [];
      for (let cost of data.loan_proposal.loan_detail.cost_of_loan){
        if (cost.fixed_amount != 0){
          cost.value = cost.fixed_amount
        } else {
          cost.value = (cost.percent/100) * data.loan_proposal.loan_proposed;
        }
        cost.currency = "Birr";
        cost.placeholder = "";
        data.cost_of_loan.push (cost);
      }
    }
    data.loan_proposal.cash_at_hand = data.loan_proposal.loan_proposed - data.loan_proposal.loan_detail.total_deductibles;

    data.cashFlowOrder = [];
    let firstExpenseMonthIndex = config.MONTHS.find(elt=>elt.full_name === data.first_expense_month).index;
    let loop = true; let index = firstExpenseMonthIndex;
    data.cashFlowOrder.push (config.MONTHS[index]);
    if (index == 11) {index = 0} else index++; 
    while (loop){
      if (index == firstExpenseMonthIndex) loop = false;
      else {
        data.cashFlowOrder.push(config.MONTHS[index]);
        if (index == 11) index = 0; else index++;
      }
    }

    data.sections[0] = yield orderCashFlowForSection(data.sections[0], data.cashFlowOrder);
    data.sections[0].sub_sections[0] = yield orderCashFlowForSection(data.sections[0].sub_sections[0], data.cashFlowOrder);
    data.sections[0].sub_sections[0].sub_sections[0] = yield orderCashFlowForSection(data.sections[0].sub_sections[0].sub_sections[0], data.cashFlowOrder);
    data.sections[0].sub_sections[0].sub_sections[1] = yield orderCashFlowForSection(data.sections[0].sub_sections[0].sub_sections[1], data.cashFlowOrder);
    data.sections[0].sub_sections[0].sub_sections[2] = yield orderCashFlowForSection(data.sections[0].sub_sections[0].sub_sections[2], data.cashFlowOrder);
    data.sections[0].sub_sections[1] = yield orderCashFlowForSection(data.sections[0].sub_sections[1], data.cashFlowOrder);
    data.sections[0].sub_sections[2] = yield orderCashFlowForSection(data.sections[0].sub_sections[2], data.cashFlowOrder);
    
    data.sections[1] = yield orderCashFlowForSection(data.sections[1], data.cashFlowOrder);
    data.sections[1].sub_sections[0] = yield orderCashFlowForSection(data.sections[1].sub_sections[0], data.cashFlowOrder);
    data.sections[1].sub_sections[1] = yield orderCashFlowForSection(data.sections[1].sub_sections[1], data.cashFlowOrder);
    data.sections[1].sub_sections[2] = yield orderCashFlowForSection(data.sections[1].sub_sections[2], data.cashFlowOrder);

    
    data.seed_cost_items = yield orderCashFlowForItem(data.sections[0].sub_sections[0].sub_sections[0].cost_list.linear.slice(),data.cashFlowOrder);
    data.fertilizer_cost_items =  yield orderCashFlowForItem(data.sections[0].sub_sections[0].sub_sections[1].cost_list.linear.slice(),data.cashFlowOrder);
    data.insecticide_cost_items = yield orderCashFlowForItem(data.sections[0].sub_sections[0].sub_sections[2].cost_list.grouped[0].items.slice(),data.cashFlowOrder);
    data.fungicide_cost_items = yield orderCashFlowForItem(data.sections[0].sub_sections[0].sub_sections[2].cost_list.grouped[1].items.slice(),data.cashFlowOrder);
    data.laborcost_cost_items =  yield orderCashFlowForItem(data.sections[0].sub_sections[1].cost_list.linear.slice(),data.cashFlowOrder);
    data.othercost_cost_items =  yield orderCashFlowForItem(data.sections[0].sub_sections[2].cost_list.linear.slice(),data.cashFlowOrder);

    data = yield orderCashFlowForCropACAT(data,data.cashFlowOrder);
    data.currency = "Birr";
    
    
    let template = "./templates/" + "CLIENT_ACAT_DETAIL_TEMPLATE.xlsx";
    //let template = "./templates/" + "test.docx";
    let docGenerator = new XLSX_GENERATOR(); 
    let report = yield docGenerator.generateXlsx(data, template);

    let buf = Buffer.from(report); 
    this.body = report;    

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GENERATE_ACAT_PRINT_OUT_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Update a single ACAT.
 *
 * @desc Fetch a ACAT with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateACAT(next) {
  debug(`updating ACAT: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'UPDATE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }


  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  let canApprove = yield hasPermission(this.state._user, 'AUTHORIZE');

  if(body.is_client_acat) {
    this.checkBody('status')
      .notEmpty('Status should not be empty')
      .isIn(['loan_paid','inprogress', 'submitted', 'resubmitted', 'authorized', 'declined_for_review'], 'Correct Status is either loan_paid, inprogress, resubmitted, authorized, submitted or declined_for_review');

    if(this.errors) {
      return this.throw(new CustomError({
        type: 'UPDATE_ACAT_ERROR',
        message: JSON.stringify(this.errors)
      }));
  }


  }

  try {
    if(body.status === 'authorized' || body.status === 'declined_for_review' ) {
      if(!canApprove) {
        throw new Error("You Don't have enough permissions to complete this action");
      }
    }

    let clientACAT;
    let comment = body.comment;
    let task;

    if(body.is_client_acat && body.client_acat) {
      clientACAT = yield ClientACAT.findOne({ _id: body.client_acat}).exec();
      if(!clientACAT) {
        throw new Error('Client ACAT Does Not Exist')
      }
    }

    let ACAT = yield ACATDal.update(query, body);
    if(!ACAT) throw new Error('ACAT Does Not Exist');

    let client = yield ClientDal.get({ _id: ACAT.client });

    if(body.status === 'declined_for_review') {
      task = yield TaskDal.update({ entity_ref: ACAT._id }, { status: 'completed', comment: comment });
      if(task) {
        // Create Review Task
        let _task = yield TaskDal.create({
          task: `Review Crop ACAT Application of ${client.first_name} ${client.last_name}`,
          task_type: 'review',
          entity_ref: ACAT._id,
          entity_type: 'ACAT',
          created_by: this.state._user._id,
          user: ACAT.created_by,
          branch: client.branch._id,
          comment: comment
        });
        yield NotificationDal.create({
          for: ACAT.created_by,
          message: `Crop ACAT Application of ${client.first_name} ${client.last_name} has been declined For Further Review`,
          task_ref: _task._id
        });
      }


    } else if(body.status == 'resubmitted'){
      task = yield TaskDal.update({ entity_ref: ACAT._id }, { status: 'completed', comment: comment });
      if(task) {
        yield NotificationDal.create({
          for: task.created_by,
          message: `Crop ACAT Application of ${client.first_name} ${client.last_name} has been Resubmitted`,
          task_ref: task._id
        });
      }

    } else if(body.status == 'authorized') {
      task = yield TaskDal.update({ entity_ref: ACAT._id }, { status: 'completed', comment: comment });
      if(task) {
        yield NotificationDal.create({
          for: task.created_by,
          message: `Crop ACAT Application of ${client.first_name} ${client.last_name} has been Authorized`,
          task_ref: task._id
        });
      }
    }


    if(body.is_client_acat) {
      for(let acat of clientACAT.ACATs){
        //yield computeValues(acat);
      }
    }

    yield LogDal.track({
      event: 'acat_update',
      user: this.state._user._id ,
      message: `Update Info for ${ACAT.title}`,
      diff: body
    });

    this.body = ACAT;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'UPDATE_ACAT_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of ACATs by Pagination
 *
 * @desc Fetch a collection of acats
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllACATs(next) {
  debug('get a collection of ACATs by pagination');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_ACAT_COLLECTION_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  // retrieve pagination query params
  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};

  let sortType = this.query.sort_by;
  let sort = {};
  sortType ? (sort[sortType] = -1) : (sort.date_created = -1 );

  let opts = {
    page: +page,
    limit: +limit,
    sort: sort
  };

  try {
    let ACATs = yield ACATDal.getCollectionByPagination(query, opts);

    this.body = ACATs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'FETCH_ACAT_COLLECTION_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Remove a single acat.
 *
 * @desc Fetch a acat with the given id from the database
 *       and Remove their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.remove = function* removeACAT(next) {
  debug(`removing screening: ${this.params.id}`);

  let isPermitted = yield hasPermission(this.state._user, 'REMOVE');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'REMOVE_ACAT_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    _id: this.params.id
  };

  try {
    let acat = yield ACATDal.delete(query);
    if(!acat._id) {
      throw new Error('ACATForm Does Not Exist!');
    }

    for(let section of acat.sections) {
      section = yield SectionDal.delete({ _id: section._id });
      if(section.sub_section.length) {
        for(let _section of section.sub_sections) {
          yield SectionDal.delete({ _id: _section._id });
        }
      }
    }

    yield LogDal.track({
      event: 'acat_delete',
      permission: this.state._user._id ,
      message: `Delete Info for ${acat._id}`
    });

    this.body = acat;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'REMOVE_ACAT_FORM_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a client  ACATs
 *
 * @desc Fetch a collection of acats for a given client
 *
 * @param {Function} next Middleware dispatcher
 */
exports.getClientACATs = function* getClientACATs(next) {
  debug('get a collection of ACATs for a client');

  let isPermitted = yield hasPermission(this.state._user, 'VIEW');
  if(!isPermitted) {
    return this.throw(new CustomError({
      type: 'VIEW_CLIENT_ACATS_ERROR',
      message: "You Don't have enough permissions to complete this action"
    }));
  }

  let query = {
    client: this.params.id
  };


  try {
    let ACATs = yield ACATDal.getCollection(query);

    this.body = ACATs;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'GET_CLIENT_ACATS_ERROR',
      message: ex.message
    }));
  }
};

/**
 * Search Acat instance
 *
 * @desc Search a collection of acat instances
 *
 * @param {Function} next Middleware dispatcher
 */
exports.search = function* searchAcats(next) {
  debug('Search a collection of acats by pagination');

  // retrieve pagination query params
  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;

  let sortType = this.query.sort_by;
  let sort = {};
  sortType ? (sort[sortType] = -1) : (sort.date_created = -1 );

  let opts = {
    page: +page,
    limit: +limit,
    sort: sort
  };

  try {

    let user = this.state._user;
    let query = {};

    let returnFields = null;

    if (this.query.fields) {
      returnFields = {
        _id: 1
      };

      let unfiltered = this.query.fields.split(",")

      unfiltered.forEach(function(field){
        returnFields[field] = 1;
      })
      delete this.query.fields;
    }


     let qsKeys = Object.keys(this.query)

     if (this.query.branch) {
      let clients  = yield Client.find({ branch: this.query.branch }, '_id').exec();
      let clientIds = clients.map(function (client){
        return client._id;
      })

      delete this.query.branch;

      this.query.client = clientIds.slice()
     }

    let gpsRegistered = false;
    if (this.query.gps_registered) {
      gpsRegistered =  true;

      delete this.query.gps_registered;
    }

    for(let key of qsKeys) {
      query[key] = query[key] || {
        $in: []
      };
      let vals = this.query[key];

      let values = Array.isArray(vals) ? vals.slice() : [vals]

      query[key] = {
        $in: values.slice()
      }
    }

    // rebuild with $or
    qsKeys = Object.keys(query);
    let _qs = []
    qsKeys.forEach((item)=>{
      let _item = {}
      if (item === 'branch') {
        _item["client.branch"] = query[item]
      } else {
        _item[item] = query[item]
      }
      
      _qs.push(_item)
    })

    query = {
      $or: _qs
    }

    if (gpsRegistered) {
      query['gps_location.single_point.status'] = 'ACCEPTED';
    }
  
    let acats = yield ACATDal.getCollectionByPagination(query, opts, returnFields);

    this.body = acats;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SEARCH_ACATS_ERROR',
      message: ex.message
    }));
  }
};

// Utilities

function computeValues(acat) {
  return co(function* () {
    let inputEstimatedSubTotal = 0;
    let inputAchievedSubTotal = 0;
    let iac = null;

    acat = yield ACATDal.get({ _id: acat });

    // compute input totals
    for(let section of acat.sections) {
      section = yield SectionDal.get({ _id: section._id });

      if(section.title == 'Inputs And Activity Costs') {
        iac = section._id;
        for(let sub of section.sub_sections) {
          switch(sub.title) {
              case 'Labour Cost':
                inputAchievedSubTotal += sub.achieved_sub_total;
                inputEstimatedSubTotal += sub.estimated_sub_total;

              break;
              case 'Other Costs':
                inputAchievedSubTotal += sub.achieved_sub_total;
                inputEstimatedSubTotal += sub.estimated_sub_total;


              break;
              case 'Input':
                let achievedSubtotal = 0;
                let estimatedSubtotal = 0;

                for(let ssub of sub.sub_sections) {
                  
                  achievedSubtotal += ssub.achieved_sub_total;
                  estimatedSubtotal += ssub.estimated_sub_total;
                }

                inputAchievedSubTotal += achievedSubtotal;
                inputEstimatedSubTotal += estimatedSubtotal;

              break;
            }
        }
      } // IAC

      if(section.title == 'Revenue') {
        for(let _sub of section.sub_sections) {
          _sub = yield SectionDal.get({ _id: _sub._id });
          for(let sub of _sub.sub_sections) {
             if(sub.title == 'Probable Yield') {
              inputAchievedSubTotal += sub.achieved_sub_total;
             }

             inputEstimatedSubTotal += sub.estimated_sub_total;

          }
        }
      }

    }

    yield SectionDal.update({ _id: iac },{
      achieved_sub_total: inputAchievedSubTotal,
      estimated_sub_total: inputEstimatedSubTotal
    })

  });
}


//

function polygonFromPoint(longitude, latitude) {
  let size = 15;
  let metersPerDegree = 111319.49;
  let sizeInDegree = (1/metersPerDegree) * size;

  // Create square of 10m around the longitude, latitude
  let offset = sizeInDegree / 2;
  let square = [
    [(longitude - offset), (latitude + offset)],  // Upper left
    [(longitude + offset), (latitude + offset)],  // Upper right
    [(longitude + offset), (latitude - offset)],  // Lower right
    [(longitude - offset), (latitude - offset)],  // Lower left
    [(longitude - offset), (latitude + offset)]   // Upper left to close the polygon
  ];

  let squarePoly = {
     "type": "FeatureCollection",
     "crs": {
      "properties": {
       "name": "urn:ogc:def:crs:EPSG::4326"
      },
      "type": "name"
     },
     "features": [
      {
       "type": "Feature",
       "geometry": {
        "type": "Polygon",
        "coordinates": [square]
       },
       "properties": {}
      }
     ]
    }

  return squarePoly
}

function* sendToS2(body){
  let squarePoly = polygonFromPoint(body.longitude, body.latitude);
  let s2XML = fs.readFileSync('./config/s2.xml', 'utf8');

  // try S2 First
  let data = {
    USER_ID: "demo-wur",
    GROUP_ID: "Allard", // meki
    TAG: body.crop, // Onion,
    FEATURES: squarePoly
  };

  s2XML = s2XML
    .replace('{{USER_ID}}', data.USER_ID)
    .replace('{{GROUP_ID}}', data.GROUP_ID)
    .replace('{{TAG}}', data.TAG)
    .replace('{{FEATURES}}', JSON.stringify(data.FEATURES, null, '\t'))

  let opts = {
      method: 'POST',
      url: `${config.S2.URL}`,
      body: s2XML,
      headers: {
        "Content-Type": "text/xml"
      },
      qs: {
        service: "WPS",
        version: "1.0.0",
        request: "Execute"
      }
    }

    let res = yield request(opts);

    return res;
}

function* orderCashFlowForItem(costListItems, cashFlowOrder){
  
  for (let costlistItem of costListItems){
    costlistItem.estimated_cash_flow = []; costlistItem.achieved_cash_flow = []; costlistItem.placeholder = "";
    for (let i = 0; i < cashFlowOrder.length;  i++){
      let month = cashFlowOrder[i].name;
      let estimatedCashFlow = yield cashFlowToArray(costlistItem.estimated.cash_flow); 
      let achievedCashFlow = yield cashFlowToArray(costlistItem.achieved.cash_flow); 
      
      costlistItem.estimated_cash_flow.push (estimatedCashFlow.find(elt=> elt.label === month));
      costlistItem.achieved_cash_flow.push (achievedCashFlow.find(elt=> elt.label === month));

    }
  }

  return costListItems;
}

function* orderCashFlowForSection(section, cashFlowOrder){
  let estimatedCashFlow = yield cashFlowToArray(section.estimated_cash_flow); 
  let achievedCashFlow = yield cashFlowToArray(section.achieved_cash_flow); 
  section.estimated_cash_flow = []; section.achieved_cash_flow = [];
  for (let i = 0; i < cashFlowOrder.length;  i++){
    let month = cashFlowOrder[i].name;
    section.estimated_cash_flow.push (estimatedCashFlow.find(elt=> elt.label === month));
    section.achieved_cash_flow.push (achievedCashFlow.find(elt=> elt.label === month));
  }  

  return section;
}

function* orderCashFlowForCropACAT(cropACAT, cashFlowOrder){
  let estimatedCashFlow = yield cashFlowToArray(cropACAT.estimated.net_cash_flow); 
  let achievedCashFlow = yield cashFlowToArray(cropACAT.achieved.net_cash_flow); 
  cropACAT.estimated_net_cash_flow = []; cropACAT.achieved_net_cash_flow = [];
  for (let i = 0; i < cashFlowOrder.length;  i++){
    let month = cashFlowOrder[i].name;
    cropACAT.estimated_net_cash_flow.push (estimatedCashFlow.find(elt=> elt.label === month));
    cropACAT.achieved_net_cash_flow.push (achievedCashFlow.find(elt=> elt.label === month));
  }  

  return cropACAT;
}

function* cashFlowToArray(cashFlowObj){
  let cashFlowArray = [];
  cashFlowArray.push ({label: 'jan', 'value':cashFlowObj.jan});
  cashFlowArray.push ({label: 'feb', 'value':cashFlowObj.feb});
  cashFlowArray.push ({label: 'mar', 'value':cashFlowObj.mar});
  cashFlowArray.push ({label: 'apr', 'value':cashFlowObj.apr});
  cashFlowArray.push ({label: 'may', 'value':cashFlowObj.may});
  cashFlowArray.push ({label: 'june', 'value':cashFlowObj.june});
  cashFlowArray.push ({label: 'july', 'value':cashFlowObj.july});
  cashFlowArray.push ({label: 'aug', 'value':cashFlowObj.aug});
  cashFlowArray.push ({label: 'sep', 'value':cashFlowObj.sep});
  cashFlowArray.push ({label: 'oct', 'value':cashFlowObj.oct});
  cashFlowArray.push ({label: 'nov', 'value':cashFlowObj.nov});
  cashFlowArray.push ({label: 'dec', 'value':cashFlowObj.dec});

  return cashFlowArray;


}