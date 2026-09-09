import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { logger } from "config/logger";

import { DEFAULT_LANGUAGE, DEFAULT_NAMESPACE, resources } from "i18n/resources";

// synchronous init (resources are inlined, no backend) so t() returns real strings immediately; useSuspense:false avoids a Suspense boundary in the app and tests
i18n.use(initReactI18next)
    .init({
        resources,
        lng: DEFAULT_LANGUAGE,
        fallbackLng: DEFAULT_LANGUAGE,
        defaultNS: DEFAULT_NAMESPACE,
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    })
    .catch(logger.error);

export default i18n;
