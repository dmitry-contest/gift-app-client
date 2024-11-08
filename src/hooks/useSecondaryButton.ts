import { useCallback } from 'react';
import { secondaryButton } from '@telegram-apps/sdk-react';

export const useSecondaryButton = (
    text: string,
    cb: () => void,
    hideOnAction = true,
) => {
    const handleCallback = useCallback(() => {
        cb();

        if (hideOnAction) {
            hideSecondaryButton();
        }
    }, []);

    const hideSecondaryButton = useCallback(() => {
        secondaryButton.setParams({
            isVisible: false,
            position: 'left',
        });
        secondaryButton.offClick(handleCallback);
    }, []);

    const showSecondaryButton = useCallback(() => {
        secondaryButton.setParams({
            isVisible: true,
            text,
            position: 'bottom',
        });

        secondaryButton.onClick(handleCallback);
    }, [text, cb, hideOnAction, hideSecondaryButton]);

    return {
        showSecondaryButton,
        hideSecondaryButton,
    };
};
