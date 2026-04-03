const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classLevel: { type: Number, required: true }, // 11 or 12
  syllabus: { type: String, enum: ['CBSE', 'ICSE'], required: true },
  pricing: {
    oneMonth: { type: Number, required: true },
    threeMonths: { type: Number, required: true },
    sixMonths: { type: Number, required: true },
    twelveMonths: { type: Number, required: true }
  },
  teacherName: { type: String, default: 'Not Assigned' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
