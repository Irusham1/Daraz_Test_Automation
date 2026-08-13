/**
 * Application-wide constants for Daraz.lk automation
 */
const BASE_URL = 'https://www.daraz.lk';
const HOME_URL = `${BASE_URL}/#?`;

const TIMEOUTS = {
  short: 5_000,
  medium: 15_000,
  long: 30_000,
  navigation: 45_000,
};

const EXPECTED = {
  homeTitle: /Daraz\.lk/i,
  homeUrlPattern: /daraz\.lk/i,
  searchUrlPattern: /catalog\/\?.*q=/i,
  productUrlPattern: /\/products\//i,
};

const LANGUAGES = {
  english: { label: 'English', code: 'en' },
  sinhala: { label: 'සිංහල', altLabel: 'Sinhala', code: 'si' },
};

module.exports = {
  BASE_URL,
  HOME_URL,
  TIMEOUTS,
  EXPECTED,
  LANGUAGES,
};
