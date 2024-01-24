// Translates 'a' to '🇦', 'b' to '🇧' and so on.
function letterToLetterEmoji(letter: string): string {
  return String.fromCodePoint(letter.toLowerCase().charCodeAt(0) + 127365);
}

// Translates 'pl' to 'PL', 'en-US' to 'US' and so on.
function countryCodeToCountry(countryCode: string): string {
  const country = countryCode.split('-').pop() as string;

  return country.toUpperCase();
}

// Translates 'pl-PL' to 🇵🇱 and so on.
export default function getFlagEmoji(string: string): string | undefined {
  if (!string) {
    return '';
  }

  if(string === 'en' || string === 'EN') {
    return 'English󠁿';
  }
  return Array.from(countryCodeToCountry(string)).map(letterToLetterEmoji).join('');
}

export function getLanguageName(languageCode: string) {
  // Covert ISO 639-1 codes to language names: e.g. 'en' to 'English', 'no' to 'Norwegian' in these languages: afrikaans, arabisk, armensk, aserbajdsjansk, hviterussisk, bosnisk, bulgarsk, katalansk, kinesisk, kroatisk, tsjekkisk, dansk, nederlandsk, engelsk, estisk, finsk, fransk, galisisk, tysk, gresk, hebraisk, hindi, ungarsk, islandsk, indonesisk, italiensk, japansk, kannada, kasakhisk, koreansk, latvisk, litauisk, makedonsk, malaysisk, marathi, maori, nepalesisk, norsk, persisk, polsk, portugisisk, rumensk, russisk, serbisk, slovakisk, slovensk, spansk, swahili, svensk, tagalog, Tamil, thai, tyrkisk, ukrainsk, urdu, vietnamesisk og walisisk.

  return {
    'en': 'English',
    'no': 'Norwegian',
    'pl': 'Polish',
    'de': 'German',
    'fr': 'French',
    'es': 'Spanish',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'sv': 'Swedish',
    'tr': 'Turkish',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'bn': 'Bengali',
    'pa': 'Punjabi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'or': 'Oriya',
    'ur': 'Urdu',
    'as': 'Assamese',
    'si': 'Sinhala',
    'my': 'Burmese',
    'km': 'Khmer',
    'lo': 'Lao',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'ms': 'Malay',
    'am': 'Amharic',
    'ti': 'Tigrinya',
    'om': 'Oromo',
    'so': 'Somali',
    'sw': 'Swahili',
    'rw': 'Kinyarwanda',
    'ny': 'Chichewa',
    'mg': 'Malagasy',
    'eo': 'Esperanto',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'hy': 'Armenian',
  }
}
