/**
 * Integration tests: MongoDB in-memory, full HTTP stack.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-minimum-16-chars';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../src/models/User');
const Business = require('../src/models/Business');

let mongoServer;
let app;

async function registerAndToken(agent, mobile, role, name = 'Test User') {
  const res = await agent
    .post('/api/auth/register')
    .send({ name, mobile, password: 'password123', role });
  expect(res.status).toBe(201);
  return res.body.token;
}

describe('Security & API integration', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      binary: { version: process.env.MONGOMS_VERSION || '7.0.14' },
    });
    process.env.MONGO_URI = mongoServer.getUri();
    await mongoose.connect(process.env.MONGO_URI);
    app = require('../src/app');
  }, 600000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  beforeEach(async () => {
    const cols = mongoose.connection.collections;
    await Promise.all(Object.values(cols).map((c) => c.deleteMany({})));
  });

  it('rejects invalid auth register body with 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: '', mobile: '123', password: 'x', role: 'farmer' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('registers and logs in', async () => {
    const agent = request.agent(app);
    const token = await registerAndToken(agent, '9876543210', 'farmer');
    expect(token).toBeTruthy();
    const login = await agent.post('/api/auth/login').send({ mobile: '9876543210', password: 'password123' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });

  it('GET /api/auth/me returns current user', async () => {
    const agent = request.agent(app);
    const token = await registerAndToken(agent, '9888888888', 'farmer', 'Me User');
    const me = await agent.get('/api/auth/me').set('x-auth-token', token);
    expect(me.status).toBe(200);
    expect(me.body.success).toBe(true);
    expect(me.body.user.name).toBe('Me User');
    expect(me.body.user.mobile).toBe('9888888888');
  });

  it('listing CRUD: create, list all, my listings, patch', async () => {
    const agent = request(app);
    const farmerToken = await registerAndToken(agent, '9111111111', 'farmer', 'Farmer One');
    const salesmanToken = await registerAndToken(agent, '9222222222', 'salesman', 'Sales One');

    const create = await agent
      .post('/api/listings')
      .set('x-auth-token', farmerToken)
      .send({
        crop: 'Wheat',
        quantity: 10,
        pricePerUnit: 2200,
        qualityGrade: 'A',
      });
    expect(create.status).toBe(201);
    const listingId = create.body._id;

    const all = await agent.get('/api/listings').set('x-auth-token', salesmanToken);
    expect(all.status).toBe(200);
    expect(Array.isArray(all.body)).toBe(true);
    expect(all.body.length).toBe(1);

    const mine = await agent.get('/api/listings/my').set('x-auth-token', farmerToken);
    expect(mine.status).toBe(200);
    expect(mine.body[0]._id).toBe(listingId);

    const patch = await agent
      .patch(`/api/listings/${listingId}`)
      .set('x-auth-token', farmerToken)
      .send({ status: 'sold' });
    expect(patch.status).toBe(200);
    expect(patch.body.status).toBe('sold');
  });

  it('bid CRUD: place bid, list by listing, patch status', async () => {
    const agent = request(app);
    const farmerToken = await registerAndToken(agent, '9333333333', 'farmer', 'F2');
    const salesmanToken = await registerAndToken(agent, '9444444444', 'salesman', 'S2');

    const listing = await agent
      .post('/api/listings')
      .set('x-auth-token', farmerToken)
      .send({ crop: 'Rice', quantity: 5, pricePerUnit: 3000 });
    expect(listing.status).toBe(201);
    const listingId = listing.body._id;

    const bidRes = await agent
      .post('/api/bids')
      .set('x-auth-token', salesmanToken)
      .send({ listingId, offeredPrice: 2800, quantity: 5 });
    expect(bidRes.status).toBe(201);

    const forListing = await agent.get(`/api/bids/listing/${listingId}`).set('x-auth-token', farmerToken);
    expect(forListing.status).toBe(200);
    expect(forListing.body.length).toBe(1);

    const bidId = bidRes.body._id;
    const reject = await agent
      .patch(`/api/bids/${bidId}`)
      .set('x-auth-token', farmerToken)
      .send({ status: 'rejected' });
    expect(reject.status).toBe(200);
  });

  it('partner and scheme: admin creates, farmer reads', async () => {
    const agent = request(app);
    await registerAndToken(agent, '9555555555', 'farmer', 'F3');

    const admin = await User.create({
      name: 'Admin',
      mobile: '9666666666',
      password: 'adminpass12345',
      role: 'admin',
      status: 'approved',
      verified: true,
    });

    const adminToken = require('jsonwebtoken').sign(
      { user: { id: admin.id, role: 'admin' } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const partner = await agent
      .post('/api/partners')
      .set('x-auth-token', adminToken)
      .send({
        name: 'Bio Plant',
        location: 'Pune',
        type: 'Bio-Refinery',
      });
    expect(partner.status).toBe(201);

    const farmer = await User.findOne({ mobile: '9555555555' });
    const farmerToken = require('jsonwebtoken').sign(
      { user: { id: farmer.id, role: 'farmer' } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const nearby = await agent.get('/api/partners/nearby').set('x-auth-token', farmerToken);
    expect(nearby.status).toBe(200);
    expect(nearby.body.length).toBe(1);

    const scheme = await agent
      .post('/api/schemes')
      .set('x-auth-token', adminToken)
      .send({
        title: 'PM-KISAN',
        description: 'Income support',
        category: 'subsidy',
      });
    expect(scheme.status).toBe(201);

    const schemes = await agent.get('/api/schemes').set('x-auth-token', farmerToken);
    expect(schemes.status).toBe(200);
    expect(schemes.body.length).toBe(1);
  });

  it('admin routes require auth', async () => {
    const res = await request(app).get('/api/admin/analytics');
    expect(res.status).toBe(401);
  });

  it('order: create and list', async () => {
    const agent = request(app);
    const salesmanToken = await registerAndToken(agent, '9777777777', 'salesman', 'S3');

    const created = await agent
      .post('/api/order/create')
      .set('x-auth-token', salesmanToken)
      .send({
        customerName: 'ACME',
        crop: 'Wheat',
        quantity: 100,
        pricePerQtl: 2400,
        deliveryLocation: 'Indore',
      });
    expect(created.status).toBe(201);

    const list = await agent.get('/api/order/list').set('x-auth-token', salesmanToken);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);
  });

  it('sell requests: farmer submits, admin forwards, business accepts', async () => {
    const agent = request(app);

    const farmerToken = await registerAndToken(agent, '9333444444', 'farmer', 'F-SELL');
    const admin = await User.create({
      name: 'Admin Sell',
      mobile: '9333555555',
      password: 'adminpass12345',
      role: 'admin',
      status: 'approved',
      verified: true,
    });
    const adminToken = require('jsonwebtoken').sign(
      { user: { id: admin.id, role: 'admin' } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const businessToken = await registerAndToken(agent, '9333666666', 'business', 'B-SELL');

    // Create business profile (Business model) for the businessman portal.
    const bizCreate = await agent
      .post('/api/business/register')
      .set('x-auth-token', businessToken)
      .send({
        businessData: {
          orgName: 'Green Fields Mandi',
          businessType: 'Mandi',
          gstNumber: 'GSTIN12345',
          location: 'Punjab',
        },
      });

    expect(bizCreate.status).toBe(201);

    const businessDoc = await Business.findOne({ user: bizCreate.body.business.user }).lean();
    expect(businessDoc).toBeTruthy();

    const created = await agent
      .post('/api/sell-request')
      .set('x-auth-token', farmerToken)
      .send({
        cropName: 'Wheat',
        quantity: 25,
        expectedPrice: 2800,
        location: 'Ludhiana',
        description: 'Quality crop, good grains',
      });

    expect(created.status).toBe(201);
    expect(created.body.status).toBe('PENDING');
    expect(String(created.body.farmerId)).toBeTruthy();

    const pendingList = await agent
      .get('/api/admin/sell-requests')
      .set('x-auth-token', adminToken)
      .query({ status: 'PENDING' });

    expect(pendingList.status).toBe(200);
    expect(Array.isArray(pendingList.body)).toBe(true);
    expect(pendingList.body.some((r) => String(r._id) === String(created.body._id))).toBe(true);

    const assigned = await agent
      .put(`/api/admin/sell-request/${created.body._id}/assign`)
      .set('x-auth-token', adminToken)
      .send({
        assignedBusinessId: String(businessDoc._id),
        adminRemarks: 'Looks valid',
      });

    expect(assigned.status).toBe(200);
    expect(assigned.body.status).toBe('SENT_TO_BUSINESS');
    expect(String(assigned.body.assignedBusinessId)).toBe(String(businessDoc._id));

    const bizList = await agent
      .get('/api/business/sell-requests')
      .set('x-auth-token', businessToken);

    expect(bizList.status).toBe(200);
    expect(Array.isArray(bizList.body)).toBe(true);
    expect(bizList.body.some((r) => String(r._id) === String(created.body._id))).toBe(true);

    const accepted = await agent
      .put(`/api/business/sell-request/${created.body._id}/accept`)
      .set('x-auth-token', businessToken)
      .send({ businessRemarks: 'Accepted by business' });

    expect(accepted.status).toBe(200);
    expect(accepted.body.status).toBe('ACCEPTED_BY_BUSINESS');
  });
});
