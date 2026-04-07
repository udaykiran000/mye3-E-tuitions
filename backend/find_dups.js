const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const LiveSession = require('./src/models/LiveSession');
    
    const dups = await LiveSession.aggregate([
        {
            $group: {
                _id: { level: '$classLevel', start: '$startTime' },
                count: { $sum: 1 },
                subjects: { $push: '$subjectName' },
                ids: { $push: '$_id' }
            }
        },
        { $match: { count: { $gt: 1 } } }
    ]);
    
    console.log("Duplicates found:", JSON.stringify(dups, null, 2));
    process.exit();
}).catch(err => { console.error(err); process.exit(1); });
