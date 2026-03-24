const mongoose = require('mongoose');

const classBundleSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  subjects: {
    type: [String],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ClassBundle', classBundleSchema);
