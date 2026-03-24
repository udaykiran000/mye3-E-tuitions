const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  classLevel: { type: Number, required: true }, // 11 or 12
  price: { type: Number, required: true },
  teacherName: { type: String, default: 'Not Assigned' }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
