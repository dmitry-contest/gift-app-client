import {
    init,
    miniApp,
    initData,
    themeParams,
    $debug,
    mainButton,
    secondaryButton,
    backButton,
} from '@telegram-apps/sdk-react';

export const initTelegramSDK = ({ debug }: { debug: boolean }): void => {
    $debug.set(debug);

    init();

    miniApp.mount();
    initData.restore();
    themeParams.mount();

    mainButton.mount();
    secondaryButton.mount();
    backButton.mount();
};
