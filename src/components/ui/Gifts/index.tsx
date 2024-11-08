import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import EmptyPlate from 'src/components/ui/EmptyPlate';
import { useApi } from 'src/hooks/useApi';
import { DataContext } from 'src/context/DataProvider';
import GiftsList from 'src/components/ui/GiftsList';
import { GIFT_SIZE_SM } from 'src/constants/gifts';
import Modal from 'src/components/ui/Modal';
import GiftInfo from 'src/components/ui/GiftInfo';
import { switchInlineQuery } from '@telegram-apps/sdk-react';
import { TGiftsPageGiftData, TGiftsPageGiftItem } from 'src/types/api';
import { useMainButton } from 'src/hooks/useMainButton';

import s from './Gifts.module.scss';

const getData = (gift: TGiftsPageGiftItem) => ({
    key: `${gift.id}${gift.hash}`,
});

const Gifts = () => {
    const { t } = useTranslation();
    const { getMe, getStore } = useApi();
    const [modalGift, setModalGift] = useState<TGiftsPageGiftItem>();
    const {
        data: { user, store },
    } = useContext(DataContext);

    useEffect(() => {
        getStore();
        getMe();
    }, [getMe, getStore]);

    const data: TGiftsPageGiftData = useMemo(() => {
        return user?.gifts?.paid && user.gifts.paid.length > 0
            ? user.gifts.paid.flatMap(paidGift => {
                  const storeData = store.find(
                      storeItem => storeItem.id === paidGift.giftId,
                  );
                  if (!storeData) {
                      return [];
                  }
                  return [
                      {
                          ...paidGift,
                          ...(storeData ?? {}),
                      },
                  ];
              })
            : [];
    }, [store, user]);

    const sendGiftToContact = useCallback(() => {
        if (modalGift) {
            switchInlineQuery(`${modalGift.hash} `, ['users']);
        }
    }, [modalGift]);

    const { showMainButton, hideMainButton } = useMainButton(
        t('sendToContact'),
        sendGiftToContact,
        false,
    );

    useEffect(() => {
        if (modalGift) {
            showMainButton();
        } else {
            hideMainButton();
        }
    }, [modalGift, showMainButton, hideMainButton]);

    const handleGiftClick = useCallback((gift: TGiftsPageGiftItem) => {
        setModalGift(gift);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalGift(undefined);
    }, []);

    return (
        <div className={s.container}>
            <span className={cn(['title1', s.title])}>
                {t('pages.gifts.title')}
            </span>
            <span className={cn(['text', s.description])}>
                {t('pages.gifts.description')}
            </span>
            {data.length > 0 ? (
                <GiftsList<TGiftsPageGiftItem>
                    getData={getData}
                    data={data}
                    size={GIFT_SIZE_SM}
                    onClick={handleGiftClick}
                    options={{
                        action: {
                            name: t('send'),
                        },
                        withHeader: false,
                        withGiftName: true,
                        nameClassName: s.giftNameClassName,
                        className: s.giftClassName,
                    }}
                />
            ) : (
                <EmptyPlate text={t('pages.gifts.empty')} />
            )}
            {modalGift && (
                <Modal onClose={handleCloseModal}>
                    <GiftInfo<TGiftsPageGiftItem>
                        gift={modalGift}
                        type="send"
                    />
                </Modal>
            )}
        </div>
    );
};

export default memo(Gifts);
