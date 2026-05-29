const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  postOffice: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    branchType: {
      type: String,
      enum: ['BO', 'BD', 'SO', 'HO'],
      default: 'BO'
    },
    deliveryStatus: {
      type: String,
      enum: ['Delivery', 'Non-Delivery'],
      default: 'Delivery'
    },
    circle: String,
    district: {
      type: String,
      required: true,
      index: true
    },
    division: String,
    region: String,
    block: String,
    state: {
      type: String,
      required: true,
      index: true
    },
    country: {
      type: String,
      default: 'India'
    },
    pincode: {
      type: String,
      required: true
    }
  }],
  // Additional location data
  coordinates: {
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lon: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  // Agricultural data specific to this pincode
  agricultural: {
    mainCrops: [String],
    soilType: String,
    rainfall: {
      annual: Number,
      seasonal: {
        monsoon: Number,
        winter: Number,
        summer: Number
      }
    },
    temperature: {
      summer: {
        min: Number,
        max: Number
      },
      winter: {
        min: Number,
        max: Number
      }
    }
  },
  // Market data
  markets: [{
    name: String,
    type: {
      type: String,
      enum: ['mandi', 'wholesale', 'retail'],
      default: 'mandi'
    },
    distance: Number, // in km
    code: String // Agmarknet market code
  }],
  // Language preferences for the region
  languages: [{
    code: {
      type: String,
      enum: ['en', 'hi', 'gu', 'bn', 'ta', 'te', 'mr', 'kn', 'ml', 'pa', 'or', 'as'],
      default: 'en'
    },
    name: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
pincodeSchema.index({ 'postOffice.state': 1, 'postOffice.district': 1 });
pincodeSchema.index({ 'postOffice.district': 1, pincode: 1 });
pincodeSchema.index({ 'coordinates.lat': 1, 'coordinates.lon': 1 });

// Static method to find by pincode with populated data
pincodeSchema.statics.findByPincodeWithDetails = function(pincode) {
  return this.findOne({ 
    pincode: pincode, 
    isActive: true 
  })
  .select('+coordinates +agricultural +markets +languages')
  .lean();
};

// Static method to find nearby pincodes
pincodeSchema.statics.findNearby = function(lat, lon, maxDistance = 50) {
  return this.find({
    'coordinates.lat': { $exists: true },
    'coordinates.lon': { $exists: true },
    isActive: true
  })
  .where('coordinates.lat').gte(lat - (maxDistance / 111)).lte(lat + (maxDistance / 111))
  .where('coordinates.lon').gte(lon - (maxDistance / (111 * Math.cos(lat * Math.PI / 180))))
  .lte(lon + (maxDistance / (111 * Math.cos(lat * Math.PI / 180))))
  .limit(10)
  .lean();
};

// Instance method to get primary language
pincodeSchema.methods.getPrimaryLanguage = function() {
  const primaryLang = this.languages.find(lang => lang.isPrimary);
  return primaryLang ? primaryLang.code : 'en';
};

// Instance method to get market codes
pincodeSchema.methods.getMarketCodes = function() {
  return this.markets
    .filter(market => market.code)
    .map(market => market.code);
};

// Pre-save middleware to ensure data consistency
pincodeSchema.pre('save', function(next) {
  // Ensure pincode field matches postOffice pincode
  if (this.postOffice && this.postOffice.length > 0) {
    this.postOffice.forEach(office => {
      if (office.pincode && office.pincode !== this.pincode) {
        office.pincode = this.pincode;
      }
    });
  }
  
  // Set primary language if not set
  if (this.languages && this.languages.length > 0 && !this.languages.some(lang => lang.isPrimary)) {
    this.languages[0].isPrimary = true;
  }
  
  next();
});

module.exports = mongoose.model('Pincode', pincodeSchema);
