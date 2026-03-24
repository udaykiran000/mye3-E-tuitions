const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassBundle',
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'notes'
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
