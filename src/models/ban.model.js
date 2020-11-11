const mongoose = require('mongoose');
const validator = require('validator');
const banReasons = require('../config/banReasons');
const banTimes = require('../config/banTimes');

const banSchema = mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      validate(value) {
        return validator.default.isIP(value);
      },
    },
    post: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    reason: {
      type: String,
      required: true,
      enum: banReasons,
    },
    until: {
      type: Number,
      default: () => banTimes.permaban(),
    },
  },
  {
    timestamps: true,
  }
);

const Ban = mongoose.model('Ban', banSchema);

module.exports = Ban;
