import "styles/global.scss";

import { setupListeners } from "@reduxjs/toolkit/query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";

import { createStore } from "redux/store";

import i18n from "i18n/index";

import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

const store = createStore();

// enables refetchOnFocus / refetchOnReconnect
setupListeners(store.dispatch);

createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <App />
            </I18nextProvider>
        </Provider>
    </StrictMode>,
);
