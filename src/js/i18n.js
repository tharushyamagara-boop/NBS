/**
 * SUNCASA Bilingual Engine (English & Ikinyarwanda)
 */

import enLocale from '../data/locales/en.json';
import rwLocale from '../data/locales/rw.json';
import indicatorNarratives from '../data/locales/indicator_narratives.json';

class I18nManager {
  constructor() {
    this.locales = {
      en: enLocale,
      rw: rwLocale
    };
    this.narratives = indicatorNarratives;
    this.currentLocale = localStorage.getItem('suncasa_lang') || 'en';
  }

  init() {
    this.applyLocale(this.currentLocale);
    this.setupListeners();
  }

  setupListeners() {
    const btnEn = document.getElementById('btn-lang-en');
    const btnRw = document.getElementById('btn-lang-rw');

    if (btnEn && btnRw) {
      btnEn.addEventListener('click', () => this.setLocale('en'));
      btnRw.addEventListener('click', () => this.setLocale('rw'));
    }
  }

  setLocale(locale) {
    if (this.currentLocale === locale) return;
    this.currentLocale = locale;
    localStorage.setItem('suncasa_lang', locale);
    this.applyLocale(locale);

    // Dispatch global event for other components (maps, charts, cards)
    window.dispatchEvent(new CustomEvent('suncasa:localeChanged', {
      detail: { locale }
    }));
  }

  applyLocale(locale) {
    document.documentElement.lang = locale;
    const strings = this.locales[locale] || this.locales.en;

    // Update active state on toggle buttons
    const btnEn = document.getElementById('btn-lang-en');
    const btnRw = document.getElementById('btn-lang-rw');
    if (btnEn && btnRw) {
      btnEn.classList.toggle('active', locale === 'en');
      btnRw.classList.toggle('active', locale === 'rw');
    }

    // Replace all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.getNestedValue(strings, key);
      if (val) {
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });
  }

  getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : null, obj);
  }

  t(keyPath) {
    const val = this.getNestedValue(this.locales[this.currentLocale], keyPath);
    if (val !== null) return val;
    // Fallback to English
    return this.getNestedValue(this.locales.en, keyPath) || keyPath;
  }

  getNarrative(indicatorId) {
    const item = this.narratives[indicatorId];
    if (!item) return null;
    return item[this.currentLocale] || item.en;
  }
}

export const i18n = new I18nManager();
