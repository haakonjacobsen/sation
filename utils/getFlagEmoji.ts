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
  if(string === 'en' || string === 'EN') {
    return 'English󠁿';
  }
  if (!string) {
    return '';
  }

  return Array.from(countryCodeToCountry(string)).map(letterToLetterEmoji).join('');
}
