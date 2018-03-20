// ACAT Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

const FORM     = require ('../lib/enums').FORM

var Schema = mongoose.Schema;

var ClientACATSchema = new Schema({
    client:         { type: Schema.Types.ObjectId, ref: 'Client' },
    branch:         { type: Schema.Types.ObjectId, ref: 'Branch' },
    created_by:     { type: Schema.Types.ObjectId, ref: 'Account' },
    loan_product:   { type: Schema.Types.ObjectId, ref: 'LoanProduct', default: null },
    ACATs:          [{ type: Schema.Types.ObjectId, ref: 'ACAT'}],
    total_cost:     { type: Number, default: 0 },
    total_revenue:  { type: Number, default: 0 },
    net_cash_flow:  { type: Number, default: 0 },
    cumulative_cash_flow:  { type: Number, default: 0 },
    date_created:   { type: Date },
    last_modified:  { type: Date }
});

// add mongoose-troop middleware to support pagination
ClientACATSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
ClientACATSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter ACAT Attributes to expose
 */
ClientACATSchema.statics.attributes = {
  client: 1,
  branch: 1,
  created_by: 1,
  loan_product: 1,
  ACATs: 1,
  total_cost: 1,
  total_revenue: 1,
  net_cash_flow: 1,
  cumulative_cash_flow: 1,
  date_created: 1,
  last_modified: 1,
  _id: 1
};


// Expose ACAT model
module.exports = mongoose.model('ClientACAT', ClientACATSchema);