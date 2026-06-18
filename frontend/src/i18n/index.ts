import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common from "i18n/locales/en/common.json";

// synchronous init (resources are inlined, no backend) so t() returns real strings
// immediately; useSuspense:false avoids a Suspense boundary in the app and tests
i18n.use(initReactI18next)
    .init({
        resources: { en: { common } },
        lng: "en",
        fallbackLng: "en",
        defaultNS: "common",
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    })
    .catch(console.error);

export default i18n;
