'use strict';
/**
 * Load Module Dependencies.
 */
const crypto  = require('crypto');
const path    = require('path');
const url     = require('url');
const fs      = require('fs');

const debug       = require('debug')('api:acat-controller');
const moment      = require('moment');
const jsonStream  = require('streaming-json-stringify');
const _           = require('lodash');
const co          = require('co');
const del         = require('del');
const validator   = require('validator');
const request          = require('request-promise')

const config              = require('../config');
const CustomError         = require('../lib/custom-error');
const checkPermissions    = require('../lib/permissions');
const FORM                = require ('../lib/enums').FORM;

const ACATForm       = require('../models/ACATForm');
const Section        = require('../models/ACATSection');
const ClientACAT     = require('../models/clientACAT');
const Client         = require('../models/client');

const TokenDal         = require('../dal/token');
const FormDal          = require('../dal/ACATForm');
const LogDal           = require('../dal/log');
const SectionDal       = require('../dal/ACATSection');
const CostListDal      = require('../dal/costList');
const ClientACATDal    = require('../dal/clientACAT');
const ClientDal        = require('../dal/client');
const ACATDal          = require('../dal/ACAT');
const TaskDal    = require('../dal/task');
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

  this.checkBody('latitude')
      .notEmpty('Latitude is Empty');
  this.checkBody('longitude')
      .notEmpty('Longitude is Empty');
  this.checkBody('type')
      .notEmpty('GPS location is Empty')
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
      let singlePoint = geolocation.single_point;

      if (singlePoint.latitude === body.latitude &&
         singlePoint.longitude === body.longitude &&
         singlePoint.S2_Id !== "NULL") {
        throw new Error("Single Point Has Already Been Registered")
      }

      let s2Res = yield sendToS2(body);
      let gps_registered = false;

      body.s2 = s2Res

      try {
        s2Res = JSON.parse(s2Res)
      } catch(ex) {
        //
        s2Res = null;
      }

      if (!s2Res) {
        geolocation.single_point = {
          longitude: body.longitude,
          latitude: body.latitude,
          status: "DECLINED"
        }
      } else {
        gps_registered = true;
        geolocation.single_point = {
          longitude: body.longitude,
          latitude: body.latitude,
          status: "ACCEPTED",
          S2_Id: s2Res.field_id
        }
      }

    } else if (body.type === 'polygon') {
      let polygon = geolocation.polygon;

      let isRegistered = polygon.some(function iter(coord) {
        return (coord.latitude === body.latitude && coord.longitude === body.longitude);
      })

      if (isRegistered) {
        throw new Error("Polygon Point Has Already Been Registered")
      }

      geolocation.polygon.push({
        longitude: body.longitude,
        latitude: body.latitude,
        status: "ACCEPTED",
        S2_Id: s2Res.field_id
      })
      gps_registered = true;
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
      gps_registered: gps_registered
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

    return res
}