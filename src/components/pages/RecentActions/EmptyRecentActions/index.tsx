import { memo, useCallback, useEffect } from 'react';
import { useMainButton } from 'src/hooks/useMainButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { STORE_PAGE } from 'src/constants/menu';
import { useBackButton } from 'src/hooks/useBackButton';
import Balloons from 'src/icons/balloons.svg?react';

import s from './EmptyRecentActions.module.scss';

const EmptyRecentActions = () => {
    const { t } = useTranslation();
    const { hideBackButton } = useBackButton();
    const navigate = useNavigate();

    const handleOpenStore = useCallback(() => {
        navigate(`/${STORE_PAGE}`);
        hideBackButton();
    }, [navigate, hideBackButton]);

    const { showMainButton, hideMainButton } = useMainButton(
        t('openStore'),
        handleOpenStore,
    );

    useEffect(() => {
        showMainButton();

        return () => hideMainButton();
    }, [showMainButton, hideMainButton]);

    return (
        <div className={s.container}>
            <Balloons />
            <span className={s.title}>{t('emptyHistory.title')}</span>
            <span className={s.hint}>{t('emptyHistory.hint')}</span>
        </div>
    );
};

export default memo(EmptyRecentActions);
