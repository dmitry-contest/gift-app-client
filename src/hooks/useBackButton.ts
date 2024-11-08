import { useCallback, useRef } from 'react';
import { backButton } from '@telegram-apps/sdk-react';

export const useBackButton = (cb?: () => void, hideOnAction = true) => {
    const offClick = useRef<VoidFunction>();

    const hideBackButton = useCallback(() => {
        offClick.current?.();
        backButton.hide();
    }, []);

    const showBackButton = useCallback(() => {
        offClick.current = backButton.onClick(() => {
            cb?.();

            if (hideOnAction) {
                hideBackButton();
            }
        });
        backButton.show();
    }, [cb, hideBackButton, hideOnAction]);

    return {
        showBackButton,
        hideBackButton,
    };
};
