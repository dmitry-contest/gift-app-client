import { useTranslation } from 'react-i18next';
import { useLottieGift } from 'src/hooks/useLottieGift';
import Currency from 'src/components/ui/Currency';
import GiftsAmount from 'src/components/ui/GiftsAmount';
import { getDateTime } from 'src/utils/getDateTime';
import Avatar from 'src/components/ui/Avatar';
import UserName from 'src/components/ui/UserName';
import { TGiftsPageGiftItem, TProfileGift } from 'src/types/api';
import { useCallback } from 'react';
import Stars from 'src/components/ui/Stars';

import s from './GiftInfo.module.scss';

interface IGiftInfoProps<T> {
    readonly gift: T;
    readonly type: 'profile' | 'send';
    readonly onUserClick?: (id: number) => void;
}

export default <T extends TProfileGift | TGiftsPageGiftItem>(
    props: IGiftInfoProps<T>,
) => {
    const { gift, type, onUserClick } = props;
    const { t } = useTranslation();

    const { View } = useLottieGift(`gift-${gift.name}`, {
        loop: true,
        className: s.lottie,
    });

    const { date, time } = getDateTime(gift.date);

    const handleUserNameClick = useCallback(() => {
        if ('tgUser' in gift) {
            onUserClick?.(gift.tgUser.id);
        }
    }, [onUserClick, gift]);

    return (
        <div className={s.container}>
            {View}
            <Stars />
            <h1 className={s.title}>
                {type === 'profile'
                    ? t(`gifts.${gift.name}`)
                    : t('pages.confirmation.sendGift')}
            </h1>
            <div className={s.table}>
                <div className={s.columnNames}>
                    <span>
                        {type === 'profile' ? t('modal.from') : t('modal.gift')}
                    </span>
                    <span>{t('modal.date')}</span>
                    <span>{t('modal.price')}</span>
                    <span>{t('modal.availability')}</span>
                </div>
                <div className={s.values}>
                    {type === 'profile' && 'tgUser' in gift ? (
                        <div className={s.senderInfo}>
                            <Avatar
                                size={20}
                                firstName={gift.tgUser.firstName}
                                lastName={gift.tgUser.lastName}
                                url={gift.tgUser.avatarUrl}
                            />
                            <button type="button" onClick={handleUserNameClick}>
                                <UserName
                                    firstName={gift.tgUser.firstName}
                                    lastName={gift.tgUser.lastName}
                                    showPremiumIcon={false}
                                    textClassName={s.userNameText}
                                />
                            </button>
                        </div>
                    ) : (
                        <div>{t(`gifts.${gift.name}`)}</div>
                    )}
                    <div>{t('modal.dateTime', { date, time })}</div>
                    <Currency
                        iconSize={20}
                        inverted
                        currency={gift.currency}
                        price={gift.price}
                        className={s.currency}
                    />
                    <div>
                        <GiftsAmount
                            amount={gift.amount}
                            available={gift.storeOrderNum}
                            skipFormat
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
