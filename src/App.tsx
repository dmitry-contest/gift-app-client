import 'src/styles/general.scss';
import { I18nextProvider } from 'react-i18next';
import { Router } from 'src/routes';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { initTelegramSDK } from 'src/init';
import ThemeProvider, { TTheme } from 'src/context/ThemeProvider';
import {
    useLaunchParams,
    themeParams,
    miniApp,
} from '@telegram-apps/sdk-react';
import i18n, { i18nInit } from 'src/i18n';

import { DARK_THEME, LIGHT_THEME } from 'src/constants/themes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EN, LANGUAGE_LIST } from 'src/constants/languages';
import CommonProvider from 'src/context/CommonProvider';
import DataProvider from 'src/context/DataProvider';
import { LANGUAGE_KEY, THEME_KEY } from 'src/constants/localStorage';
import { useApi } from 'src/hooks/useApi';

initTelegramSDK({ debug: __DEV__ });

function fallbackRender({ error }: FallbackProps) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: 'red' }}>{error.message}</pre>
        </div>
    );
}
const channel = new BroadcastChannel('contest-gift-app-channel');

const App = () => {
    const { initData, startParam } = useLaunchParams();
    const { getMe } = useApi();

    const [isInstanceInitialized, setInstanceInitialized] =
        useState<boolean>(false);

    useEffect(() => {
        channel.postMessage({ type: 'INIT_INSTANCE', isInstanceInitialized });

        channel.onmessage = event => {
            if (event.data.type === 'INIT_INSTANCE') {
                if (
                    event.data.isInstanceInitialized !== isInstanceInitialized
                ) {
                    if (startParam) {
                        window.localStorage.setItem('startParam', startParam);
                    }
                    miniApp.close();
                } else {
                    setInstanceInitialized(true);
                }
            }
        };
    }, [isInstanceInitialized, startParam]);

    const tgUser = useMemo(() => initData?.user, [initData]);

    const initialTheme = useMemo(() => {
        const lsTheme = window.localStorage.getItem(THEME_KEY) as TTheme | null;
        const paramsTheme = themeParams.isDark() ? DARK_THEME : LIGHT_THEME;

        return lsTheme ?? paramsTheme;
    }, []);

    const initLanguage = useCallback(async () => {
        const { isInitialized } = i18n;
        if (isInitialized) {
            return;
        }

        const lsLang = window.localStorage.getItem(LANGUAGE_KEY);

        const { languageCode = EN } = tgUser || {};
        const lng = LANGUAGE_LIST.includes(languageCode) ? languageCode : EN;

        await i18nInit({ lng: lsLang ?? lng });
    }, [tgUser]);

    useEffect(() => {
        getMe();
        initLanguage();
    }, [initLanguage, getMe]);

    return (
        <ErrorBoundary fallbackRender={fallbackRender}>
            <CommonProvider>
                <ThemeProvider initialTheme={initialTheme}>
                    <DataProvider>
                        <I18nextProvider i18n={i18n}>
                            <Router />
                        </I18nextProvider>
                    </DataProvider>
                </ThemeProvider>
            </CommonProvider>
        </ErrorBoundary>
    );
};

export default App;
