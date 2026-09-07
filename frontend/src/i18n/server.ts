import { createInstance } from "i18next";

import { DEFAULT_LANGUAGE, DEFAULT_NAMESPACE, resources } from "i18n/resources";

// metadata is generated outside the React tree, where useTranslation is unavailable.
// The language is an argument rather than a module constant, so adding locale-aware
// routing later means passing a different value, not rewriting every caller. A fresh
// instance per call keeps one request's language out of another's.
export const getServerTranslation = async (
    language: string = DEFAULT_LANGUAGE,
    namespace: string = DEFAULT_NAMESPACE,
) => {
    const instance = createInstance();

    await instance.init({
        resources,
        lng: language,
        fallbackLng: DEFAULT_LANGUAGE,
        defaultNS: namespace,
        interpolation: { escapeValue: false },
    });

    return instance.getFixedT(language, namespace);
};
