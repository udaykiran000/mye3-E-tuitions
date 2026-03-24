const ClassBundle = require('../models/ClassBundle');
const Subject = require('../models/Subject');
const User = require('../models/User');

const seedData = async () => {
  try {
    // 1. Seed ClassBundles
    const defaultClasses = [
      { className: 'Class 6', price: 999, subjects: ['Maths', 'Science', 'English', 'Social Studies'] },
      { className: 'Class 7', price: 999, subjects: ['Maths', 'Science', 'English', 'Social Studies'] },
      { className: 'Class 8', price: 1099, subjects: ['Maths', 'Science', 'English', 'Social Studies'] },
      { className: 'Class 9', price: 1499, subjects: ['Maths', 'Science', 'Physics', 'Chemistry', 'Biology'] },
      { className: 'Class 10', price: 1499, subjects: ['Maths', 'Science', 'Physics', 'Chemistry', 'Biology'] },
    ];

    for (const classData of defaultClasses) {
      const existing = await ClassBundle.findOne({ className: classData.className });
      if (!existing) {
        await ClassBundle.create(classData);
        console.log(`Seeded Bundle: ${classData.className}`);
      }
    }

    // 2. Seed Admin User
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Master Admin',
        email: 'admin@mye3.com',
        password: 'adminpassword',
        role: 'admin'
      });
      console.log('Seeded Admin: admin@mye3.com');
    }

    // 3. Seed Teachers
    const teachers = [
      { name: 'Dr. Emily Watson', email: 'emily@mye3.com', password: 'teacherpassword', role: 'teacher' },
      { name: 'Prof. Arjun Singh', email: 'arjun@mye3.com', password: 'teacherpassword', role: 'teacher' }
    ];
    for (const t of teachers) {
      if (!(await User.findOne({ email: t.email }))) {
        await User.create(t);
        console.log(`Seeded Teacher: ${t.email}`);
      }
    }

    // 4. Seed Students
    const students = [
      { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'studentpassword', role: 'student' },
      { name: 'Priya Patel', email: 'priya@gmail.com', password: 'studentpassword', role: 'student' },
      { name: 'Sneha Reddy', email: 'sneha@gmail.com', password: 'studentpassword', role: 'student' }
    ];
    for (const s of students) {
      if (!(await User.findOne({ email: s.email }))) {
        await User.create(s);
        console.log(`Seeded Student: ${s.email}`);
      }
    }

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
