const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    category: {
      type: String,
      required: true,
      enum: ['Cereals', 'Pulses', 'Oilseeds', 'Vegetables', 'Fruits', 'Cash Crops', 'Spices', 'Other'],
      default: 'Other'
    },
    season: {
      type: String,
      required: true,
      enum: ['Kharif', 'Rabi', 'Zaid', 'All Season', 'Spring', 'Summer', 'Fall', 'Winter', 'Monsoon', 'Dry Season', 'Wet Season'],
      default: 'All Season'
    },
    description: {
      type: String,
      maxlength: 2000,
      default: ''
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: { 
      type: String, 
      default: 'INR',
      enum: ['INR', 'USD', 'GBP', 'CAD', 'AUD', 'BRL', 'MXN', 'ARS', 'ZAR', 'KES', 'NGN', 'PHP', 'MYR', 'SGD', 'THB', 'VND', 'IDR', 'CNY', 'JPY', 'KRW', 'RUB', 'EUR', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'TRY', 'EGP', 'SAR', 'AED', 'ILS', 'PKR', 'BDT', 'LKR', 'NPR', 'BTN', 'MMK', 'KHR', 'LAK', 'MNT']
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'quintal', 'ton', 'bushel', 'pound', 'tonne', 'metric_ton', 'short_ton', 'long_ton', 'hundredweight', 'bag', 'crate', 'box', 'basket', 'bundle', 'bunch', 'head', 'piece', 'unit'],
      default: 'quintal'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    country: { 
      type: String, 
      default: 'IN',
      enum: ['IN', 'US', 'GB', 'CA', 'AU', 'BR', 'MX', 'AR', 'ZA', 'KE', 'NG', 'PH', 'MY', 'SG', 'TH', 'VN', 'ID', 'CN', 'JP', 'KR', 'RU', 'DE', 'FR', 'IT', 'ES', 'NL', 'PL', 'TR', 'EG', 'SA', 'AE', 'IL', 'PK', 'BD', 'LK', 'NP', 'BT', 'MM', 'KH', 'LA', 'MM']
    },
    region: { type: String }, // Regional crop availability
    growingSeason: { type: String }, // Local growing season info
    language: { 
      type: String, 
      default: 'en',
      enum: ['en', 'hi', 'pa', 'mr', 'te', 'ta', 'gu', 'kn', 'ml', 'bn', 'or', 'as', 'ur', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'tr', 'th', 'vi', 'id', 'ms', 'sw', 'zu', 'af', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sr', 'sl', 'et', 'lv', 'lt', 'uk', 'be', 'ka', 'hy', 'az', 'kk', 'ky', 'uz', 'tg', 'mn', 'km', 'lo', 'my']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', CropSchema);
