// ACATSection Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

var ACATSectionSchema = new Schema({       
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
    variety:         { type: String },
    seed_source:     { type: String },
    sub_sections:    [{ type: Schema.Types.ObjectId, ref: 'ACATSection' }],
    estimated:       {
      yield: {
        uofm_for_yield: { type: String },
        max:            { type: Number }
      },
      price: {
        uofm_for_price: { type: String },
        max:            { type: Number }
      }
    },
    achieved:       {
      yield: {
        uofm_for_yield: { type: String },
        max:            { type: Number }
      },
      price: {
        uofm_for_price: { type: String },
        max:            { type: Number }
      }
    },
    marketable_yield: {
      own:          { type: String },
      seed_reserve: { type: String },
      for_market:   { type: String }
    },
    number:          { type: String, default: '' },
    date_created:    { type: Date },
    last_modified:   { type: Date }
});

// add mongoose-troop middleware to support pagination
ACATSectionSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
ACATSectionSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter ACATSection Attributes to expose
 */
ACATSectionSchema.statics.attributes = {      
  title:              1,
  estimated_total:    1,
  achieved_sub_total: 1,
  cash_flow:       1,
  cost_list:       1,
  variety:         1,
  seed_source:     1,
  sub_sections:    1,
  number:          1,
  estimated:  1,
  achieved:   1,
  marketable_yield: 1,
  date_created: 1,
  last_modified: 1,
  _id: 1
};


// Expose ACATSection model
module.exports = mongoose.model('ACATSection', ACATSectionSchema);