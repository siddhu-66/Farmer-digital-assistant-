const mongoose = require('mongoose');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
const Business = require('./models/Business');
const Listing = require('./models/Listing');
const Bid = require('./models/Bid');
const Partner = require('./models/Partner');
const Scheme = require('./models/Scheme');
const dotenv = require('dotenv');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmer_assistant');
    console.log('Connected to MongoDB for full ecosystem seeding...');
    
    // 1. Clear ALL collections
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await Business.deleteMany({});
    await Listing.deleteMany({});
    await Bid.deleteMany({});
    await Partner.deleteMany({});
    await Scheme.deleteMany({});
    console.log('Cleared all dynamic collections.');

    // 2. Create Admin
    const admin = new User({
      name: 'System Admin',
      mobile: '6543210987',
      email: 'admin@system.com',
      password: 'password123',
      role: 'admin',
      status: 'approved',
      verified: true
    });
    await admin.save();
    console.log('Created Admin account.');

    // 3. Create Farmers
    const farmer1 = new User({
      name: 'Farmer John',
      mobile: '9876543210',
      email: 'john@farmer.com',
      password: 'password123',
      role: 'farmer',
      status: 'approved',
      verified: true
    });
    await farmer1.save();
    
    const farmerProfile1 = new Farmer({
      user: farmer1._id,
      experienceYears: '15',
      primaryCrops: ['Wheat', 'Rice'],
      landArea: '10 Acres',
      location: { state: 'Punjab', district: 'Ludhiana', village: 'Khanna' }
    });
    await farmerProfile1.save();

    const farmer2 = new User({
      name: 'Farmer Sahil',
      mobile: '9988776655',
      email: 'sahil@farmer.com',
      password: 'password123',
      role: 'farmer',
      status: 'approved',
      verified: true
    });
    await farmer2.save();
    console.log('Created Farmer accounts and profiles.');

    // 4. Create Salesmen (Traders)
    const salesman = new User({
      name: 'Global Trader - Mike',
      mobile: '7654321098',
      email: 'mike@trader.com',
      password: 'password123',
      role: 'salesman',
      status: 'approved',
      verified: true
    });
    await salesman.save();

    const bizProfile = new Business({
      user: salesman._id,
      orgName: 'Mansa Agri Exports',
      businessType: 'Trader',
      gstNumber: '03AAAAA0000A1Z5',
      location: 'Ludhiana, Punjab',
      status: 'approved'
    });
    await bizProfile.save();
    console.log('Created Salesman accounts and profiles.');

    // 5. Create Listings
    const listing1 = new Listing({
      farmer: farmer1._id,
      crop: 'Wheat',
      variety: 'HR-203',
      quantity: 50,
      pricePerUnit: 2200,
      qualityGrade: 'A',
      location: { state: 'Punjab', district: 'Ludhiana', village: 'Khanna' }
    });
    await listing1.save();

    const listing2 = new Listing({
      farmer: farmer2._id,
      crop: 'Basmati Rice',
      variety: '1121',
      quantity: 30,
      pricePerUnit: 4500,
      qualityGrade: 'A+',
      location: { state: 'Haryana', district: 'Karnal', village: 'Nilokheri' }
    });
    await listing2.save();
    console.log('Created initial crop listings.');

    // 6. Create Bids
    const bid1 = new Bid({
      listing: listing1._id,
      salesman: salesman._id,
      offeredPrice: 2150,
      quantity: 50,
      notes: 'Interested in bulk purchase, immediate pickup.',
      status: 'pending'
    });
    await bid1.save();
    console.log('Created sample bids.');

    // 7. Create Partners
    await Partner.insertMany([
      { name: 'EcoEnergy Bio-Refinery', type: 'Bio-Refinery', location: 'Khanna, Punjab', distance: 4.2, accepts: ['Wheat Straw', 'Rice Husk'] },
      { name: 'Punjab Cattle Feed Co.', type: 'Feed Processor', location: 'Sahnewal, Ludhiana', distance: 7.8, accepts: ['Maize Stover', 'Rice Bran'] },
      { name: 'GreenPower Thermal', type: 'Power Plant', location: 'Doraha, Punjab', distance: 12.5, accepts: ['Cotton Stalks', 'Mustard Stalks'] }
    ]);
    console.log('Seeded industrial partners.');

    // 8. Create Schemes
    await Scheme.insertMany([
      { title: 'PM KISAN Nidhi', description: 'Financial assistance of ₹6,000 per year in three equal installments.', eligibility: 'Small and marginal farmers', category: 'subsidy' },
      { title: 'PM Fasal Bima Yojana', description: 'Financial support for crop loss due to natural calamities.', eligibility: 'All farmers having insurable crops', category: 'insurance' },
      { title: 'Subsidized Agri-Equipment', description: 'Up to 50% subsidy on tractors and tillers.', eligibility: 'Registered farmers in Punjab', state: 'Punjab', category: 'subsidy' }
    ]);
    console.log('Seeded government schemes.');

    console.log('Full Ecosystem Seeding complete! 🚀');
    process.exit();
  } catch (err) {
    console.error('Error seeding full ecosystem:', err);
    process.exit(1);
  }
};

seedDB();
