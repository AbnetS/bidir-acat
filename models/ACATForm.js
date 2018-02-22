// ACATForm Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

const FORM     = require ('../lib/enums').FORM

var Schema = mongoose.Schema;

var ACATFormSchema = new Schema({
    type:           { type: String, enum: FORM.TYPES },
    title:          { type: String, default: '' },
    subtitle:       { type: String, default: '' },
    purpose:        { type: String, default: '' },     
    created_by:     { type: Schema.Types.ObjectId, ref: 'Account' },
    layout:         { type: String, default: FORM.LAYOUTS[0], enums: FORM.LAYOUTS },
    sections:       [{ type: Schema.Types.ObjectId, ref: 'ACATSection' }],
    crop:           { type: String, default: '' },
    estimated:      {
      total_cost:     { type: Number, default: 0 },
      total_revenue:  { type: Number, default: 0 },
      net_income:     { type: Number, default: 0 },
      net_cash_flow:  { type: Number, default: 0 }
    },
    achieved:      {
      total_cost:     { type: Number, default: 0 },
      total_revenue:  { type: Number, default: 0 },
      net_income:     { type: Number, default: 0 },
      net_cash_flow:  { type: Number, default: 0 }
    },
    date_created:   { type: Date },
    last_modified:  { type: Date }
});

// add mongoose-troop middleware to support pagination
ACATFormSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
ACATFormSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter ACATForm Attributes to expose
 */
ACATFormSchema.statics.attributes = {
  type: 1,
  title: 1,
  created_by: 1,
  sections: 1,
  subtitle: 1,
  purpose: 1,
  layout: 1,
  crop: 1,
  estimated: 1,
  achieved: 1,
  date_created: 1,
  last_modified: 1,
  _id: 1
};


// Expose ACATForm model
module.exports = mongoose.model('ACATForm', ACATFormSchema);