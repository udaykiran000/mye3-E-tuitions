const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  classLevel: { type: String, required: true },
  subjectName: { type: String, required: true },
  title: { type: String, required: true },
  platform: { type: String, enum: ['Zoom', 'Google Meet', 'YouTube Live'], required: true },
  link: { type: String, required: true },
  startTime: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'live', 'ended'], default: 'upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('LiveSession', liveSessionSchema);
