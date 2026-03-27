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
  subjects: [
    {
      name: { type: String, required: true },
      singleSubjectPrice: { type: Number, default: 0 }
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ClassBundle', classBundleSchema);
