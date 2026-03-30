const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ClassBundle = require('./src/models/ClassBundle');
const Subject = require('./src/models/Subject');

dotenv.config();

const bundles = [
  {
    className: 'Class 6',
    price: 999,
    subjects: [
      { name: 'Maths' },
      { name: 'Science' },
      { name: 'English' },
      { name: 'Social' },
      { name: 'Telugu/Hindi' }
    ]
  },
  {
    className: 'Class 7',
    price: 999,
    subjects: [
      { name: 'Maths' },
      { name: 'Science' },
      { name: 'English' },
      { name: 'Social' }
    ]
  },
  {
    className: 'Class 8',
    price: 1199,
    subjects: [
      { name: 'Maths' },
      { name: 'Physics Basics' },
      { name: 'Chemistry Basics' },
      { name: 'Biology' },
      { name: 'English' }
    ]
  },
  {
    className: 'Class 9',
    price: 1499,
    subjects: [
      { name: 'Maths' },
      { name: 'Physics' },
      { name: 'Chemistry' },
      { name: 'Biology' },
      { name: 'English' },
      { name: 'Social' }
    ]
  },
  {
    className: 'Class 10',
    price: 1499,
    subjects: [
      { name: 'Maths' },
      { name: 'Physics' },
      { name: 'Chemistry' },
      { name: 'Biology' },
      { name: 'English' },
      { name: 'Social' }
    ]
  }
];

const subjects = [
  // Class 11
  { name: 'Physics', classLevel: 11, price: 999 },
  { name: 'Chemistry', classLevel: 11, price: 999 },
  { name: 'Maths', classLevel: 11, price: 999 },
  { name: 'Biology', classLevel: 11, price: 999 },
  { name: 'Commerce', classLevel: 11, price: 999 },
  { name: 'Accounts', classLevel: 11, price: 999 },
  { name: 'Economics', classLevel: 11, price: 999 },
  
  // Class 12
  { name: 'Physics', classLevel: 12, price: 999 },
  { name: 'Chemistry', classLevel: 12, price: 999 },
  { name: 'Maths', classLevel: 12, price: 999 },
  { name: 'Biology', classLevel: 12, price: 999 },
  { name: 'Commerce', classLevel: 12, price: 999 },
  { name: 'Accounts', classLevel: 12, price: 999 },
  { name: 'Economics', classLevel: 12, price: 999 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await ClassBundle.deleteMany({});
    await Subject.deleteMany({});
    console.log('Cleared existing bundles and subjects.');

    // Insert Bundles (6-10)
    await ClassBundle.insertMany(bundles);
    console.log('Seed: Added Classes 6-10 Bundles');

    // Insert Subjects (11-12)
    await Subject.insertMany(subjects);
    console.log('Seed: Added Classes 11-12 Subjects');

    console.log('Database Seeding Completed Successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
