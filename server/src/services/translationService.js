/**
 * Translation Middleware Service Placeholder
 * In a production architecture, this would connect to Google Cloud Translation API,
 * AWS Translate, or a HuggingFace M2M100 model.
 */

// Simulated Translation Dictionary for the Final Year Project
const DICTIONARY = {
  te: {
    "నా పంటకు ఏ ఎరువు వేయాలి?": "Which fertilizer should I use for my crop?",
    "We recommend using Nitrogen-rich NPK for your loamy soil.": "మేము మీ లోమీ మట్టి కోసం నైట్రోజన్ పుష్కలంగా ఉన్న NPK ని సిఫార్సు చేస్తున్నాము."
  },
  hi: {
    "मुझे अपनी फसल के लिए कौन सा उर्वरक उपयोग करना चाहिए?": "Which fertilizer should I use for my crop?",
    "We recommend using Nitrogen-rich NPK for your loamy soil.": "हम आपकी दोमट मिट्टी के लिए नाइट्रोजन युक्त NPK का उपयोग करने की सलाह देते हैं।"
  },
  gu: {
    "મારે મારા પાક માટે કયા ખાતરનો ઉપયોગ કરવો જોઈએ?": "Which fertilizer should I use for my crop?",
    "We recommend using Nitrogen-rich NPK for your loamy soil.": "અમે તમારી લોમ જમીન માટે નાઇટ્રોજન સમૃદ્ધ NPK નો ઉપયોગ કરવાની ભલામણ કરીએ છીએ."
  }
};

/**
 * Translates Non-English input to English for ML Processing
 */
exports.translateToEnglish = async (text, sourceLang) => {
  if (!sourceLang || sourceLang === 'en') return text;
  
  // Simulated lookup
  if (DICTIONARY[sourceLang] && DICTIONARY[sourceLang][text]) {
    return DICTIONARY[sourceLang][text];
  }
  
  console.warn(`[TranslationService] Missing translation for ${sourceLang} -> en: "${text}"`);
  return text; // Fallback to raw text 
};

/**
 * Translates English output back to the User's preferred language
 */
exports.translateFromEnglish = async (text, targetLang) => {
  if (!targetLang || targetLang === 'en') return text;

  // Simulated lookup
  if (DICTIONARY[targetLang] && DICTIONARY[targetLang][text]) {
    return DICTIONARY[targetLang][text];
  }
  
  // Generic fallback if translation is missing for the demo
  console.warn(`[TranslationService] Missing translation for en -> ${targetLang}: "${text}"`);
  return `[${targetLang.toUpperCase()} Translated]: ${text}`;
};
