import i18next, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'src/locales';

export const ns = ['common'];

export const languages = Object.keys(resources);

const i18nConfig: InitOptions = {
    load: 'languageOnly',
    preload: languages,
    fallbackLng: languages,
    cleanCode: true,
    debug: __DEV__,
    ns,
    defaultNS: 'common',
    resources,
    interpolation: {
        escapeValue: false,
    },
    initImmediate: true,
};

export const i18nInit = async (options?: InitOptions) => {
    await i18next
        .use(initReactI18next)
        .init(options ? { ...i18nConfig, ...options } : i18nConfig);
};

export default i18next;
