import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fr from './locales/fr/translation.json'
import en from './locales/en/translation.json'

// 🔁 Personnalise l'ordre de détection (localStorage d'abord)
const detectorOptions = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: detectorOptions,
    debug: false,
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: 'fr', // Valeur par défaut si rien détecté
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
