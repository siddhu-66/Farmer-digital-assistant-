const User = require('./models/User');
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/farmer_assistant').then(async () => {
  const admin = await User.findOne({ role: 'admin' });
  console.log('Admin mobile:', admin.mobile);
  console.log('Testing password compare...');
  const result = await admin.comparePassword('admin123');
  console.log('Password admin123 matches:', result);
  const result2 = await admin.comparePassword('123456');
  console.log('Password 123456 matches:', result2);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
