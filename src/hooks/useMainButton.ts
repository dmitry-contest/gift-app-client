import { useCallback, useContext, useRef } from 'react';
import { mainButton } from '@telegram-apps/sdk-react';
import { CommonContext } from 'src/context/CommonProvider';

export const useMainButton = (
    text: string,
    cb: () => void,
    hideOnAction = true,
) => {
    const offClick = useRef<VoidFunction>();
    const { showMenu, hideMenu } = useContext(CommonContext);

    const hideMainButton = useCallback(() => {
        offClick.current?.();
        mainButton.setParams({
            isVisible: false,
        });
        showMenu();
    }, [showMenu]);

    const showMainButton = useCallback(() => {
        hideMenu();

        mainButton.setParams({
            isVisible: true,
            text,
        });
        offClick.current = mainButton.onClick(() => {
            cb();

            if (hideOnAction) {
                hideMainButton();
            }
        });
    }, [cb, hideMainButton, hideMenu, hideOnAction, text]);

    return {
        showMainButton,
        hideMainButton,
    };
};
