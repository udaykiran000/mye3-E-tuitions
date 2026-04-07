require('dotenv').config();
const mongoose = require('mongoose');
const ClassBundle = require('./src/models/ClassBundle.js');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
  const result = await ClassBundle.updateMany({ board: 'CBSE' }, { $set: { board: 'TS Board' } });
  console.log(`Updated ${result.modifiedCount} bundles from CBSE -> TS Board`);
  
  const all = await ClassBundle.find({});
  all.forEach(c => console.log(` ${c.className} -> ${c.board}`));
  
  process.exit(0);
}).catch(e => {
  console.error('DB Error:', e.message);
  process.exit(1);
});
