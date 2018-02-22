// Yield Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

var YieldSchema = new Schema({
    type:               { type: String, default: 'YIELD' },       
    title:              { type: String, default: '' },
    estimated_total:    { type: Number, default: 0 },
    achieved_sub_total: { type: Number, default: 0 },
    cash_flow:       {
      jan:             { type: String, default: '' },
      feb:             { type: String, default: '' },
      mar:             { type: String, default: '' },
      apr:             { type: String, default: '' },
      may:             { type: String, default: '' },
      june:            { type: String, default: '' },
      july:            { type: String, default: '' },
      aug:             { type: String, default: '' },
      sep:             { type: String, default: '' },
      oct:             { type: String, default: '' },
      nov:             { type: String, default: '' },
      dec:             { type: String, default: '' }
    },
    cost_list:       { type: Schema.Types.ObjectId, ref: 'CostList' },
    estimated:       {
      yield: {
        uofm_for_yield: { type: String, default: '' },
        max:            { type: Number, default: 0 }
      },
      price: {
        uofm_for_price: { type: String, default: '' },
        max:            { type: Number, default: 0 }
      }
    },
    achieved:       {
      yield: {
        uofm_for_yield: { type: String, default: '' },
        max:            { type: Number, default: 0 }
      },
      price: {
        uofm_for_price: { type: String, default: '' },
        max:            { type: Number, default: 0 }
      }
    },
    marketable_yield: {
      own:  { type: String, default: '' },
      seed_reserve: { type: String, default: '' },
      for_market: { type: String, default: '' }
    },
    date_created:    { type: Date },
    last_modified:   { type: Date }
});

// add mongoose-troop middleware to support pagination
YieldSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
YieldSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter Yield Attributes to expose
 */
YieldSchema.statics.attributes = {
  title: 1,
  type: 1,
  estimated: 1,
  achieved: 1,
  achieved_sub_total: 1,
  estimated_total: 1,
  cash_flow: 1,
  cost_list: 1,
  date_created: 1,
  last_modified: 1,
  _id: 1
};


// Expose Yield model
module.exports = mongoose.model('Yield', YieldSchema);