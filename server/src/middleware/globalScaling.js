// Global scaling middleware for API responses
const addGlobalContext = (req, res, next) => {
  // Get user preferences from JWT token or session
  const user = req.user || {};
  
  // Set default global context
  req.globalContext = {
    country: user.country || 'IN',
    currency: user.currency || 'INR',
    language: user.language || 'en',
    timezone: user.timezone || 'Asia/Kolkata',
    cropUnit: user.cropUnit || 'quintal',
    // Add locale-specific formatting
    locale: getLocaleFromCountry(user.country || 'IN'),
    dateFormat: getDateFormatFromCountry(user.country || 'IN'),
    numberFormat: getNumberFormatFromCountry(user.country || 'IN')
  };

  // Add global context to response headers
  res.set('X-Global-Country', req.globalContext.country);
  res.set('X-Global-Currency', req.globalContext.currency);
  res.set('X-Global-Language', req.globalContext.language);
  res.set('X-Global-Timezone', req.globalContext.timezone);
  res.set('X-Global-CropUnit', req.globalContext.cropUnit);

  const originalJson = res.json;
  res.json = function (data) {
    if (Array.isArray(data)) {
      return originalJson.call(this, data);
    }

    if (data !== null && typeof data === 'object') {
      const payload = typeof data.toJSON === 'function' ? data.toJSON() : data;
      return originalJson.call(this, { ...payload, global: req.globalContext });
    }

    return originalJson.call(this, { value: data, global: req.globalContext });
  };

  next();
};

// Helper functions to get locale-specific settings
function getLocaleFromCountry(country) {
  const localeMap = {
    'IN': 'en-IN',
    'US': 'en-US',
    'GB': 'en-GB',
    'CA': 'en-CA',
    'AU': 'en-AU',
    'BR': 'pt-BR',
    'MX': 'es-MX',
    'AR': 'es-AR',
    'ZA': 'en-ZA',
    'KE': 'en-KE',
    'NG': 'en-NG',
    'PH': 'en-PH',
    'MY': 'en-MY',
    'SG': 'en-SG',
    'TH': 'th-TH',
    'VN': 'vi-VN',
    'ID': 'id-ID',
    'CN': 'zh-CN',
    'JP': 'ja-JP',
    'KR': 'ko-KR',
    'RU': 'ru-RU',
    'DE': 'de-DE',
    'FR': 'fr-FR',
    'IT': 'it-IT',
    'ES': 'es-ES',
    'NL': 'nl-NL',
    'PL': 'pl-PL',
    'TR': 'tr-TR',
    'EG': 'ar-EG',
    'SA': 'ar-SA',
    'AE': 'ar-AE',
    'IL': 'he-IL',
    'PK': 'ur-PK',
    'BD': 'bn-BD',
    'LK': 'si-LK',
    'NP': 'ne-NP'
  };
  return localeMap[country] || 'en-US';
}

function getDateFormatFromCountry(country) {
  const formatMap = {
    'IN': 'DD/MM/YYYY',
    'US': 'MM/DD/YYYY',
    'GB': 'DD/MM/YYYY',
    'CA': 'YYYY-MM-DD',
    'AU': 'DD/MM/YYYY',
    'BR': 'DD/MM/YYYY',
    'MX': 'DD/MM/YYYY',
    'AR': 'DD/MM/YYYY',
    'ZA': 'YYYY/MM/DD',
    'KE': 'DD/MM/YYYY',
    'NG': 'DD/MM/YYYY',
    'PH': 'MM/DD/YYYY',
    'MY': 'DD/MM/YYYY',
    'SG': 'DD/MM/YYYY',
    'TH': 'DD/MM/YYYY',
    'VN': 'DD/MM/YYYY',
    'ID': 'DD/MM/YYYY',
    'CN': 'YYYY/MM/DD',
    'JP': 'YYYY/MM/DD',
    'KR': 'YYYY/MM/DD',
    'RU': 'DD.MM.YYYY',
    'DE': 'DD.MM.YYYY',
    'FR': 'DD/MM/YYYY',
    'IT': 'DD/MM/YYYY',
    'ES': 'DD/MM/YYYY',
    'NL': 'DD-MM-YYYY',
    'PL': 'DD.MM.YYYY',
    'TR': 'DD.MM.YYYY',
    'EG': 'DD/MM/YYYY',
    'SA': 'DD/MM/YYYY',
    'AE': 'DD/MM/YYYY',
    'IL': 'DD/MM/YYYY',
    'PK': 'DD/MM/YYYY',
    'BD': 'DD/MM/YYYY',
    'LK': 'YYYY/MM/DD',
    'NP': 'YYYY/MM/DD'
  };
  return formatMap[country] || 'DD/MM/YYYY';
}

function getNumberFormatFromCountry(country) {
  const formatMap = {
    'IN': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'US': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'GB': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'CA': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'AU': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'BR': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'MX': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'AR': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'ZA': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'KE': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'NG': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'PH': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'MY': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'SG': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'TH': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'VN': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'ID': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'CN': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'JP': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'KR': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'RU': { decimalSeparator: ',', thousandsSeparator: ' ', decimalPlaces: 2 },
    'DE': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'FR': { decimalSeparator: ',', thousandsSeparator: ' ', decimalPlaces: 2 },
    'IT': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'ES': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'NL': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'PL': { decimalSeparator: ',', thousandsSeparator: ' ', decimalPlaces: 2 },
    'TR': { decimalSeparator: ',', thousandsSeparator: '.', decimalPlaces: 2 },
    'EG': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'SA': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'AE': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'IL': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'PK': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'BD': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'LK': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 },
    'NP': { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 }
  };
  return formatMap[country] || { decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2 };
}

module.exports = { addGlobalContext };
