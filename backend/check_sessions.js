const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const ClassBundle = require('./src/models/ClassBundle');
  const LiveSession = require('./src/models/LiveSession');

  // Check Class 6 bundle subjects
  const bundle = await ClassBundle.findOne({ className: 'Class 6' }).lean();
  console.log("Class 6 bundle subjects:", bundle?.subjects?.map(s => s.name));

  // Check live sessions
  const sessions = await LiveSession.find().sort({ createdAt: -1 }).lean();
  console.log("\nAll sessions:");
  sessions.forEach(s => {
    console.log(`- classLevel: "${s.classLevel}" | subjectName: "${s.subjectName}" | board: "${s.board}" | startTime: ${s.startTime}`);
  });

  process.exit();
}).catch(err => { console.error(err); process.exit(1); });
