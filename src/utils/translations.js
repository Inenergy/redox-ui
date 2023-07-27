const { derived, writable } = require('svelte/store');
const { capitalize } = require('./others');

class Translator {
  constructor() {
    this.fallbackLng = 'en';
    this.dictionary = {};
    this.stores = {};
    this.locale = writable();
    this.lng = this.fallbackLng;
    this.__ = derived(this.locale, () => this.t.bind(this));
  }
  addMessages(lng, dic) {
    this.dictionary[lng] = dic;
  }
  setLocale(lng) {
    if (!this.dictionary[lng]) this.lng = this.fallbackLng;
    else this.lng = lng;
    this.locale.set(this.lng);
  }
  t(key, noCapitalize) {
    if (!key) return;
    const translation = this.dictionary[this.lng][key] || key;
    return noCapitalize ? translation : capitalize(translation);
  }
}

const translator = new Translator();
translator.addMessages('ru', require('../../locale/ru.json'));
translator.addMessages('en', require('../../locale/en.json'));
translator.addMessages('zh', require('../../locale/zh.json'));
translator.setLocale(process.env.LANG.slice(0, 2));
translator.setLocale('zh');

module.exports = translator;
