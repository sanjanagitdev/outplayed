import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const fallbackLng = ["en"];
const availableLanguages = ["en", "es"];

i18n.use(Backend)

    .use(LanguageDetector) // detect user language

    .use(initReactI18next) // pass the i18n instance to react-i18next.

    .init({
        react: {
            useSuspense: false,
        },
        fallbackLng,
        debug: true,
        whitelist: availableLanguages,
        compatibilityJSON: true,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
