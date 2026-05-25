const mongoose = require('mongoose');

const SELL_REQUEST_STATUSES = [
  'PENDING',
  'APPROVED_BY_ADMIN',
  'REJECTED_BY_ADMIN',
  'SENT_TO_BUSINESS',
  'ACCEPTED_BY_BUSINESS',
  'REJECTED_BY_BUSINESS',
  'COMPLETED',
];

const StatusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedByRole: { type: String },
  remarks: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const SellRequestSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    quantityUnit: { type: String, enum: ['kg', 'quintal', 'ton', 'bushel', 'pound', 'tonne', 'metric_ton', 'short_ton', 'long_ton', 'hundredweight', 'bag', 'crate', 'box', 'basket', 'bundle', 'bunch', 'head', 'piece', 'unit'], default: 'quintal' },
    expectedPrice: { type: Number, required: true },
    currency: { 
      type: String, 
      default: 'INR',
      enum: ['INR', 'USD', 'GBP', 'CAD', 'AUD', 'BRL', 'MXN', 'ARS', 'ZAR', 'KES', 'NGN', 'PHP', 'MYR', 'SGD', 'THB', 'VND', 'IDR', 'CNY', 'JPY', 'KRW', 'RUB', 'EUR', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'TRY', 'EGP', 'SAR', 'AED', 'ILS', 'PKR', 'BDT', 'LKR', 'NPR', 'BTN', 'MMK', 'KHR', 'LAK', 'MNT']
    },
    location: { type: String, required: true },
    
    // Global-scale location fields
    country: { 
      type: String, 
      default: 'IN',
      enum: ['IN', 'US', 'GB', 'CA', 'AU', 'BR', 'MX', 'AR', 'ZA', 'KE', 'NG', 'PH', 'MY', 'SG', 'TH', 'VN', 'ID', 'CN', 'JP', 'KR', 'RU', 'DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'TR', 'EG', 'SA', 'AE', 'IL', 'PK', 'BD', 'LK', 'NP', 'BT', 'MM', 'KH', 'LA', 'MM']
    },
    state: { type: String },
    district: { type: String },
    village: { type: String },
    pincode: { type: String },
    timezone: { 
      type: String, 
      default: 'Asia/Kolkata',
      enum: ['Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Manila', 'Asia/Kuala_Lumpur', 'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Stockholm', 'Europe/Copenhagen', 'Europe/Oslo', 'Europe/Helsinki', 'Europe/Warsaw', 'Europe/Prague', 'Europe/Budapest', 'Europe/Bucharest', 'Europe/Sofia', 'Europe/Belgrade', 'Europe/Zagreb', 'Europe/Ljubljana', 'Europe/Tallinn', 'Europe/Riga', 'Europe/Vilnius', 'Europe/Kiev', 'Europe/Minsk', 'Europe/Moscow', 'Europe/Istanbul', 'Europe/Athens', 'Europe/Cairo', 'Africa/Johannesburg', 'Africa/Cairo', 'Africa/Lagos', 'Africa/Nairobi', 'America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Denver', 'America/Phoenix', 'America/Mexico_City', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Santiago', 'America/Lima', 'America/Bogota', 'America/Caracas', 'America/Guayaquil', 'America/La_Paz', 'America/Asuncion', 'America/Montevideo', 'America/Paramaribo', 'America/Georgetown', 'America/Port_of_Spain', 'America/Santo_Domingo', 'America/Havana', 'America/Jamaica', 'America/Belize', 'America/Guatemala', 'America/El_Salvador', 'America/Tegucigalpa', 'America/Managua', 'America/Costa_Rica', 'America/Panama', 'America/Cayman', 'America/Nassau', 'America/Toronto', 'America/Vancouver', 'America/Montreal', 'America/Edmonton', 'America/Winnipeg', 'America/Regina', 'America/Halifax', 'America/St_Johns', 'America/Anchorage', 'America/Juneau', 'America/Yakutat', 'America/Whitehorse', 'America/Dawson', 'America/Adak', 'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Majuro', 'Pacific/Tarawa', 'Pacific/Fakaofo', 'Pacific/Kiritimati', 'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Tahiti', 'Pacific/Rarotonga', 'Pacific/Easter', 'Atlantic/Reykjavik', 'Atlantic/Bermuda', 'Atlantic/Madeira', 'Atlantic/Canary', 'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Atlantic/Stanley', 'Atlantic/St_Helena', 'Atlantic/Ascension', 'Atlantic/South_Georgia', 'Indian/Mauritius', 'Indian/Maldives', 'Indian/Mahe', 'Indian/Kerguelen', 'Indian/Chagos', 'Indian/Cocos', 'Indian/Christmas', 'Antarctica/Davis', 'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Casey', 'Antarctica/DumontDUrville', 'Antarctica/Vostok']
    },
    language: { 
      type: String, 
      default: 'en',
      enum: ['en', 'hi', 'pa', 'mr', 'te', 'ta', 'gu', 'kn', 'ml', 'bn', 'or', 'as', 'ur', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'tr', 'th', 'vi', 'id', 'ms', 'sw', 'zu', 'af', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sr', 'sl', 'et', 'lv', 'lt', 'uk', 'be', 'ka', 'hy', 'az', 'kk', 'ky', 'uz', 'tg', 'mn', 'km', 'lo', 'my']
    },
    
    description: { type: String },
    image: { type: String },
    
    // Crop quality and grade for ML integration
    cropGrade: { type: String, enum: ['A+', 'A', 'B', 'C'], default: 'B' },
    qualityScore: { type: Number, min: 0, max: 100 },
    predictedPrice: { type: Number },
    season: { type: String },
    
    status: { type: String, enum: SELL_REQUEST_STATUSES, default: 'PENDING', index: true },
    assignedBusinessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
    
    // Remarks from different roles
    adminRemarks: { type: String },
    businessRemarks: { type: String },
    
    // Status history for audit trail
    statusHistory: [StatusHistorySchema],
    
    // ML prediction data
    mlPredictions: {
      quality: {
        score: Number,
        confidence: Number,
        factors: [String],
        predictedAt: Date
      },
      price: {
        predicted: Number,
        confidence: Number,
        marketTrend: String,
        predictedAt: Date
      }
    }
  },
  { timestamps: true }
);

// Add status to history before saving
SellRequestSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('SellRequest', SellRequestSchema);

