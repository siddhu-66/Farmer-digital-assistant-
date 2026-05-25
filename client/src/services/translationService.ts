// Translation service — uses native fetch for external translation APIs (Google/LibreTranslate)

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

const TRANSLATION_API_URL = process.env.NEXT_PUBLIC_TRANSLATION_API_URL;
const TRANSLATION_API_KEY = process.env.NEXT_PUBLIC_TRANSLATION_API_KEY;

export const translationService = {
  /**
   * Translates text to a target language using the configured API.
   * Supports both Google Cloud Translation and LibreTranslate formats.
   */
  translateText: async (text: string, targetLanguage: string): Promise<string> => {
    if (!TRANSLATION_API_URL || !TRANSLATION_API_KEY) {
      console.warn('Translation API not configured. Returning original text.');
      return text;
    }
    
    try {
      // Logic for Google Cloud Translation API (v2)
      if (TRANSLATION_API_URL.includes('googleapis.com')) {
        const url = `${TRANSLATION_API_URL}?key=${TRANSLATION_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: text, target: targetLanguage }),
        });
        const data = await res.json() as { data?: { translations?: { translatedText: string }[] } };
        return data.data?.translations?.[0]?.translatedText || text;
      }
      
      // Logic for LibreTranslate API
      const response = await fetch(TRANSLATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLanguage,
          format: 'text',
          api_key: TRANSLATION_API_KEY
        })
      });
      const data = await response.json();
      return data.translatedText || text;
    } catch (err) {
      console.error('Translation failed:', err);
      return text;
    }
  }
};
