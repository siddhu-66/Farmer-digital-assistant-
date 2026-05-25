const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmer_assistant');
    const count = await User.countDocuments();
    console.log(`Current user count: ${count}`);
    const users = await User.find({}, 'name mobile role status');
    console.log('Users in DB:');
    console.log(JSON.stringify(users, null, 2));
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkDB();
