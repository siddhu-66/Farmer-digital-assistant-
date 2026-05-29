const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Pincode = require('../models/Pincode');
const connectDB = require('../config/db');

// Sample CSV data - replace with your actual CSV file path
const CSV_FILE_PATH = path.join(__dirname, 'pincodes.csv');

async function importPincodes() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing pincodes (optional - remove if you want to keep existing data)
    await Pincode.deleteMany({});
    console.log('Cleared existing pincodes');

    // Read CSV file
    if (!fs.existsSync(CSV_FILE_PATH)) {
      console.log('CSV file not found. Creating sample data...');
      await createSampleData();
      return;
    }

    const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    console.log(`Found ${lines.length - 1} records in CSV`);

    const pincodes = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const record = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });

      // Map CSV fields to Pincode schema
      const pincodeData = {
        pincode: record.pincode || record.Pincode,
        postOffice: [{
          name: record.officename || record.officeName || 'Unknown',
          description: record.description || '',
          branchType: record.branchType || 'BO',
          deliveryStatus: record.deliveryStatus || 'Delivery',
          circle: record.circleName || '',
          district: record.districtname || record.district || 'Unknown',
          division: record.divisionname || '',
          region: record.regionname || '',
          block: record.blockname || '',
          state: record.statename || record.state || 'Unknown',
          country: 'India',
          pincode: record.pincode || record.Pincode
        }],
        coordinates: {
          lat: parseFloat(record.lat || record.latitude) || 0,
          lon: parseFloat(record.lng || record.longitude) || 0
        },
        markets: [{
          name: record.marketName || 'Local Mandi',
          type: 'mandi',
          distance: parseFloat(record.distance) || 0,
          code: record.marketCode || ''
        }]
      };

      pincodes.push(pincodeData);

      // Insert in batches of 100
      if (pincodes.length >= 100) {
        await Pincode.insertMany(pincodes);
        console.log(`Imported ${pincodes.length} pincodes...`);
        pincodes.length = 0;
      }
    }

    // Insert remaining records
    if (pincodes.length > 0) {
      await Pincode.insertMany(pincodes);
      console.log(`Imported final ${pincodes.length} pincodes`);
    }

    console.log('Import completed successfully!');
    
  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

async function createSampleData() {
  const samplePincodes = [
    {
      pincode: '110001',
      postOffice: [{
        name: 'Delhi G.P.O.',
        district: 'Central Delhi',
        state: 'Delhi',
        pincode: '110001'
      }],
      coordinates: { lat: 28.6139, lon: 77.2090 },
      markets: [{
        name: 'Azadpur Mandi',
        type: 'mandi',
        distance: 5,
        code: 'DEL001'
      }]
    },
    {
      pincode: '400001',
      postOffice: [{
        name: 'Mumbai G.P.O.',
        district: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }],
      coordinates: { lat: 19.0760, lon: 72.8777 },
      markets: [{
        name: 'Vashi Market',
        type: 'mandi',
        distance: 8,
        code: 'MUM001'
      }]
    },
    {
      pincode: '560001',
      postOffice: [{
        name: 'Bangalore G.P.O.',
        district: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      }],
      coordinates: { lat: 12.9716, lon: 77.5946 },
      markets: [{
        name: 'KR Market',
        type: 'mandi',
        distance: 3,
        code: 'BLR001'
      }]
    }
  ];

  await Pincode.insertMany(samplePincodes);
  console.log('Sample data created successfully!');
}

// Run the import
if (require.main === module) {
  importPincodes();
}

module.exports = { importPincodes, createSampleData };