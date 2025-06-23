// Comprehensive multi-language translation system
const API_KEY = "AIzaSyD1OwQsLBGjV397BTqBH4oOhbd3IBy1gNU";

// Supported languages with their codes and names
export const SUPPORTED_LANGUAGES = {
  hi: "Hindi",
  bn: "Bengali",
  te: "Telugu",
  ta: "Tamil",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
  as: "Assamese",
  ur: "Urdu",
  en: "English",
  sa: "Sanskrit",
  ne: "Nepali",
  si: "Sinhala",
  my: "Myanmar",
  th: "Thai",
  km: "Khmer",
  lo: "Lao",
};

// Language metadata with flags and regions
export const LANGUAGE_METADATA = {
  hi: { name: "Hindi", region: "India", script: "Devanagari" },
  bn: {
    name: "Bengali",
    region: "Bangladesh/India",
    script: "Bengali",
  },
  te: { name: "Telugu", region: "India", script: "Telugu" },
  ta: { name: "Tamil", region: "India/Sri Lanka", script: "Tamil" },
  mr: { name: "Marathi", region: "India", script: "Devanagari" },
  gu: { name: "Gujarati", region: "India", script: "Gujarati" },
  kn: { name: "Kannada", region: "India", script: "Kannada" },
  ml: { name: "Malayalam", region: "India", script: "Malayalam" },
  pa: {
    name: "Punjabi",
    region: "India/Pakistan",
    script: "Gurmukhi",
  },
  or: { name: "Odia", region: "India", script: "Odia" },
  as: { name: "Assamese", region: "India", script: "Bengali" },
  ur: { name: "Urdu", region: "Pakistan/India", script: "Arabic" },
  en: { name: "English", region: "Global", script: "Latin" },
  sa: { name: "Sanskrit", region: "India", script: "Devanagari" },
  ne: { name: "Nepali", region: "Nepal", script: "Devanagari" },
  si: { name: "Sinhala", region: "Sri Lanka", script: "Sinhala" },
  my: { name: "Myanmar", region: "Myanmar", script: "Myanmar" },
  th: { name: "Thai", region: "Thailand", script: "Thai" },
  km: { name: "Khmer", region: "Cambodia", script: "Khmer" },
  lo: { name: "Lao", region: "Laos", script: "Lao" },
};

// Create a unified language list
export const LANGUAGES = Object.entries(SUPPORTED_LANGUAGES).map(
  ([code, name]) => ({
    code,
    name,
    ...LANGUAGE_METADATA[code],
  })
);

// Generic translation function
export const translateText = async (text, targetLanguage) => {
  if (!text || !targetLanguage) {
    return text;
  }

  // If target language is English, return original text
  if (targetLanguage === "en") {
    return text;
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: "text",
        }),
      }
    );

    const data = await response.json();
    return data.data?.translations[0]?.translatedText || text;
  } catch (error) {
    console.error(`Translation to ${targetLanguage} failed:`, error);
    return text; // Return original text if translation fails
  }
};

// Individual language translation functions for backward compatibility
export const translateToHindi = async (text) => {
  return translateText(text, "hi");
};

export const translateToBengali = async (text) => {
  return translateText(text, "bn");
};

export const translateToTelugu = async (text) => {
  return translateText(text, "te");
};

export const translateToTamil = async (text) => {
  return translateText(text, "ta");
};

export const translateToMarathi = async (text) => {
  return translateText(text, "mr");
};

export const translateToGujarati = async (text) => {
  return translateText(text, "gu");
};

export const translateToKannada = async (text) => {
  return translateText(text, "kn");
};

export const translateToMalayalam = async (text) => {
  return translateText(text, "ml");
};

export const translateToPunjabi = async (text) => {
  return translateText(text, "pa");
};

export const translateToOdia = async (text) => {
  return translateText(text, "or");
};

export const translateToAssamese = async (text) => {
  return translateText(text, "as");
};

export const translateToUrdu = async (text) => {
  return translateText(text, "ur");
};

export const translateToSanskrit = async (text) => {
  return translateText(text, "sa");
};

export const translateToNepali = async (text) => {
  return translateText(text, "ne");
};

export const translateToSinhala = async (text) => {
  return translateText(text, "si");
};

export const translateToMyanmar = async (text) => {
  return translateText(text, "my");
};

export const translateToThai = async (text) => {
  return translateText(text, "th");
};

export const translateToKhmer = async (text) => {
  return translateText(text, "km");
};

export const translateToLao = async (text) => {
  return translateText(text, "lo");
};

// Language detection function
export const detectLanguage = (text) => {
  if (!text) return "en";

  // Language script detection patterns
  const scriptPatterns = {
    hi: /[\u0900-\u097F]/, // Devanagari (Hindi, Marathi, Sanskrit, Nepali)
    bn: /[\u0980-\u09FF]/, // Bengali (Bengali, Assamese)
    te: /[\u0C00-\u0C7F]/, // Telugu
    ta: /[\u0B80-\u0BFF]/, // Tamil
    gu: /[\u0A80-\u0AFF]/, // Gujarati
    kn: /[\u0C80-\u0CFF]/, // Kannada
    ml: /[\u0D00-\u0D7F]/, // Malayalam
    pa: /[\u0A00-\u0A7F]/, // Gurmukhi (Punjabi)
    or: /[\u0B00-\u0B7F]/, // Odia
    ur: /[\u0600-\u06FF]/, // Arabic script (Urdu)
    si: /[\u0D80-\u0DFF]/, // Sinhala
    my: /[\u1000-\u109F]/, // Myanmar
    th: /[\u0E00-\u0E7F]/, // Thai
    km: /[\u1780-\u17FF]/, // Khmer
    lo: /[\u0E80-\u0EFF]/, // Lao
  };

  // Check for specific scripts first
  for (const [lang, pattern] of Object.entries(scriptPatterns)) {
    if (pattern.test(text)) {
      return lang;
    }
  }

  // If text contains only Latin letters, treat as English
  if (/^[A-Za-z0-9\s.,!?;:'"()\-]+$/.test(text)) {
    return "en";
  }

  // Default to Hindi for mixed content or unrecognized scripts
  return "hi";
};

// Batch translation function for multiple texts
export const translateBatch = async (texts, targetLanguage) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    return texts;
  }

  const translatedTexts = [];

  for (const text of texts) {
    const translated = await translateText(text, targetLanguage);
    translatedTexts.push(translated);
  }

  return translatedTexts;
};

// Get language display name with flag
export const getLanguageDisplayName = (languageCode) => {
  const metadata = LANGUAGE_METADATA[languageCode];
  if (!metadata) return languageCode;

  return `${metadata.name} (${metadata.region})`;
};

// Get available languages for UI
export const getAvailableLanguages = () => {
  return LANGUAGES;
};
