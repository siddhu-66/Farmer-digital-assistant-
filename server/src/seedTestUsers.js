const User = require('./models/User');

const TEST_USERS = [
  {
    name: 'Admin Test',
    email: 'admin@test.com',
    mobile: '9999900001',
    password: '123456',
    role: 'admin',
    status: 'approved',
    verified: true,
  },
  {
    name: 'Farmer Test',
    email: 'farmer@test.com',
    mobile: '9999900002',
    password: '123456',
    role: 'farmer',
    status: 'approved',
    verified: true,
  },
  {
    name: 'Sales Test',
    email: 'sales@test.com',
    mobile: '9999900003',
    password: '123456',
    role: 'salesman',
    status: 'approved',
    verified: true,
  },
];

async function ensureTestUsers() {
  const { getEnv } = require('./config/env');
  const env = getEnv();
  if (env.NODE_ENV === 'production' && process.env.SEED_TEST_USERS !== 'true') {
    return;
  }
  for (const u of TEST_USERS) {
    const emailLower = u.email.toLowerCase();
    const existing = await User.findOne({
      $or: [{ email: emailLower }, { mobile: u.mobile }],
    });
    if (!existing) {
      await User.create({
        name: u.name,
        email: emailLower,
        mobile: u.mobile,
        password: u.password,
        role: u.role,
        status: u.status,
        verified: u.verified,
      });
      console.log(`[seed] Created test user: ${u.email}`);
    }
  }
}

module.exports = { ensureTestUsers, TEST_USERS };
