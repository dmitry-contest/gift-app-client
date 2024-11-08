import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import Lottie from 'lottie-react';
import { switchInlineQuery } from '@telegram-apps/sdk-react';
import giftPurchasedAnimationData from 'src/icons/lottie/effect-gift-purchased.json';
import { useLocation, useNavigate } from 'react-router-dom';
import { GIFT_TYPE_BOUGHT } from 'src/constants/confirmation';
import { useBackButton } from 'src/hooks/useBackButton';
import { useTranslation, Trans } from 'react-i18next';
import { DataContext } from 'src/context/DataProvider';
import { PROFILE_PAGE, STORE_PAGE } from 'src/constants/menu';
import { useMainButton } from 'src/hooks/useMainButton';
import { useSecondaryButton } from 'src/hooks/useSecondaryButton';
import { useLottieGift } from 'src/hooks/useLottieGift';
import Notification from 'src/components/ui/Notification';
import { useApi } from 'src/hooks/useApi';
import { findGiftByInvoice } from 'src/utils/findGiftByInvoice';
import { getStoreGiftById } from 'src/utils/getStoreGiftById';
import { CommonContext } from 'src/context/CommonProvider';
import Loader from 'src/components/ui/Loader';

import s from './Confirmation.module.scss';

const Confirmation = () => {
    const { state } = useLocation();
    const {
        data: { store, user, receivedGift },
        updateData,
    } = useContext(DataContext);
    const { getMe, getStore, receiveGift } = useApi();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isGiftTypeBought = state.type === GIFT_TYPE_BOUGHT;
    const { loadersState } = useContext(CommonContext);

    const [hasNotification, setNotification] = useState<boolean>(false);

    useEffect(() => {
        setNotification(true);
    }, []);

    const gift = useMemo(
        () =>
            findGiftByInvoice(state.invoice, store, user) ||
            getStoreGiftById(store, String(receivedGift?.giftId)),
        [store, state.invoice, user, receivedGift?.giftId],
    );

    useEffect(() => {
        getStore();
        getMe();

        if (!isGiftTypeBought) {
            receiveGift(state.invoice);
        }

        return () => {
            updateData({ receivedGift: undefined });
        };
    }, [
        isGiftTypeBought,
        state.invoice,
        getStore,
        getMe,
        receiveGift,
        updateData,
    ]);

    const onBack = useCallback(() => {
        if (state.invoice !== undefined) {
            navigate('..');
        }
    }, [navigate, state.invoice]);

    const handleMainButtonClick = useCallback(() => {
        if (isGiftTypeBought && state.invoice) {
            switchInlineQuery(`${state.invoice} `, ['users']);
        } else {
            navigate(`../${PROFILE_PAGE}`);
        }
    }, [isGiftTypeBought, state.invoice, navigate]);

    const handleSecondaryButtonClick = useCallback(() => {
        navigate(`/${STORE_PAGE}`);
    }, [navigate]);

    const { showBackButton } = useBackButton(onBack);
    const { showMainButton, hideMainButton } = useMainButton(
        t(
            `pages.confirmation.${isGiftTypeBought ? 'sendGift' : 'openProfile'}`,
        ),
        handleMainButtonClick,
        false,
    );
    const { showSecondaryButton, hideSecondaryButton } = useSecondaryButton(
        t('openStore'),
        handleSecondaryButtonClick,
    );

    const { View: GiftView } = useLottieGift(`gift-${gift?.name}`, {
        loop: true,
        className: s.lottieGift,
    });

    useEffect(() => {
        showMainButton();
        if (isGiftTypeBought) {
            showBackButton();
            showSecondaryButton();
        }

        return () => {
            hideMainButton();
            if (isGiftTypeBought) {
                hideSecondaryButton();
            }
        };
    }, [
        state,
        showMainButton,
        hideMainButton,
        showSecondaryButton,
        isGiftTypeBought,
        showBackButton,
        hideSecondaryButton,
    ]);

    const handleCloseNotification = useCallback(() => {
        setNotification(false);
    }, []);

    const localeKey = isGiftTypeBought ? 'purchased' : 'received';

    if (
        loadersState.me &&
        loadersState.store &&
        (isGiftTypeBought ? true : loadersState.receive)
    ) {
        return <Loader />;
    }

    return (
        <div className={s.container}>
            <div className={s.innerContainer}>
                <Lottie
                    className={s.animation}
                    loop={false}
                    animationData={giftPurchasedAnimationData}
                />
                {GiftView}
                <span className={s.name}>
                    {t(`pages.confirmation.${localeKey}.name`)}
                </span>
                <span className={s.description}>
                    <Trans
                        components={{ span: <span className={s.boldText} /> }}
                        i18nKey={`pages.confirmation.${localeKey}.description`}
                        giftName={t(`gifts.${gift?.name}`)}
                        values={{
                            giftName: t(`gifts.${gift?.name}`),
                            price: gift?.price,
                            currency: gift?.currency,
                        }}
                    />
                </span>
            </div>
            {hasNotification && (
                <Notification
                    className={s.notification}
                    title={t(
                        `pages.confirmation.${localeKey}.notification.title`,
                    )}
                    description={t(
                        `pages.confirmation.${localeKey}.notification.description`,
                        {
                            giftName: t(`gifts.${gift?.name}`),
                            senderName: `${receivedGift?.fromTgUser?.firstName} ${receivedGift?.fromTgUser?.lastName}`,
                        },
                    )}
                    lottieName={`gift-${gift?.name}`}
                    action={{
                        text: t(
                            `pages.confirmation.${localeKey}.notification.action`,
                        ),
                        callback: handleMainButtonClick,
                    }}
                    onClose={handleCloseNotification}
                />
            )}
        </div>
    );
};

export default memo(Confirmation);
