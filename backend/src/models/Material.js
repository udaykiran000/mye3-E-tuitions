const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignmentId: {
    type: String, // Can be classLevel or subjectId
    required: true
  },
  classLevel: {
    type: String,
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
    type: String, // PDF or Document URL (Cloudinary/S3)
    required: true
  },
  type: {
    type: String,
    enum: ['notes', 'worksheet', 'assignment', 'other'],
    default: 'notes'
  }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
