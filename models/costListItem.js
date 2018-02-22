// CostListItem Model Definiton.

/**
 * Load Module Dependencies.
 */
var mongoose  = require('mongoose');
var moment    = require('moment');
var paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

var CostListItemSchema = new Schema({
    item:            { type: String, default: '' },
    unit:            { type: String, default: '' },
    estimated:       {
      value:            { type: Number, default: 0 },
      unit_price:       { type: Number, default: 0 },
      total_price:      { type: Number, default: 0 }
    },
    achieved:       {
      value:          { type: Number, default: 0 },
      unit_price:     { type: Number, default: 0 },
      total_price:    { type: Number, default: 0 }
    },
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
    date_created:    { type: Date },
    last_modified:   { type: Date }
});

// add mongoose-troop middleware to support pagination
CostListItemSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 *        - Hash tokens password.
 */
CostListItemSchema.pre('save', function preSaveMiddleware(next) {
  var instance = this;

  // set date modifications
  var now = moment().toISOString();

  instance.date_created = now;
  instance.last_modified = now;

  next();

});

/**
 * Filter CostListItem Attributes to expose
 */
CostListItemSchema.statics.attributes = {
  item: 1,
  unit: 1,
  estimated: 1,
  achieved: 1,
  cash_flow: 1,
  date_created: 1,
  last_modified: 1,
  _id: 1
};


// Expose CostListItem model
module.exports = mongoose.model('CostListItem', CostListItemSchema);