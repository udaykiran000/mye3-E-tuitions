require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
  const db = mongoose.connection.db;

  // 1. Drop old solo className unique index if it exists
  const indexes = await db.collection('classbundles').indexes();
  const oldIndex = indexes.find(i => i.key && i.key.className === 1 && !i.key.board && i.unique);
  if (oldIndex) {
    await db.collection('classbundles').dropIndex(oldIndex.name);
    console.log(`Dropped old unique index: ${oldIndex.name}`);
  } else {
    console.log('No old solo-className unique index found.');
  }

  // 2. Set board='TS Board' on all ClassBundles that have no board
  const cbRes = await db.collection('classbundles').updateMany(
    { $or: [{ board: { $exists: false } }, { board: null }, { board: '' }] },
    { $set: { board: 'TS Board' } }
  );
  console.log(`Updated ${cbRes.modifiedCount} ClassBundles -> board=TS Board`);

  // 3. Set board='TS Board' on all Subjects that have no board
  const subRes = await db.collection('subjects').updateMany(
    { $or: [{ board: { $exists: false } }, { board: null }, { board: '' }] },
    { $set: { board: 'TS Board' } }
  );
  console.log(`Updated ${subRes.modifiedCount} Subjects -> board=TS Board`);

  // 4. Verify
  const classes = await db.collection('classbundles').find({}).toArray();
  console.log('\nClassBundles after fix:');
  classes.forEach(c => console.log(`  ${c.className} | ${c.board}`));

  const subs = await db.collection('subjects').find({}).toArray();
  console.log('\nSubjects after fix:');
  subs.forEach(s => console.log(`  ${s.name} | level=${s.classLevel} | ${s.board}`));

  process.exit(0);
}).catch(e => {
  console.error('DB Error:', e.message);
  process.exit(1);
});
