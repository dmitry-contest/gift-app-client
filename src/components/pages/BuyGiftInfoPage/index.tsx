import { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataContext } from 'src/context/DataProvider';
import { getStoreGiftById } from 'src/utils/getStoreGiftById';
import { useMainButton } from 'src/hooks/useMainButton';
import { useBackButton } from 'src/hooks/useBackButton';
import { useTranslation } from 'react-i18next';
import Gift from 'src/components/ui/GiftsList/Gift';
import { GIFT_SIZE_LG } from 'src/constants/gifts';
import Currency from 'src/components/ui/Currency';
import Separator from 'src/components/ui/Separator';
import GiftsAmount from 'src/components/ui/GiftsAmount';
import { useApi } from 'src/hooks/useApi';
import cn from 'classnames';
import List, { TListData } from 'src/components/ui/List';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import {
    LEADERBOARD_PAGE,
    LEADERBOARD_PROFILE_PAGE,
    PROFILE_PAGE,
} from 'src/constants/menu';
import RecentActionIcon from 'src/components/pages/RecentActions/RecentActionIcon';

import s from './BuyGiftInfoPage.module.scss';

const BuyGiftInfoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { buyGift, getStoreGiftInfo } = useApi();
    const { t } = useTranslation();
    const {
        data: { store, storeGiftInfo },
    } = useContext(DataContext);
    const { initData } = useLaunchParams();

    useEffect(() => {
        if (id !== undefined) {
            getStoreGiftInfo(id);
        }
    }, [id, getStoreGiftInfo]);

    const gift = useMemo(() => getStoreGiftById(store, id), [store, id]);

    const onBack = useCallback(() => {
        navigate(`..`);
    }, [navigate]);

    const { showBackButton } = useBackButton(onBack);

    const onBuyGift = useCallback(async () => {
        if (gift) {
            await buyGift(gift.id);
        }
    }, [gift, buyGift]);

    const { showMainButton, hideMainButton } = useMainButton(
        t('buyAGift'),
        onBuyGift,
        false,
    );

    useEffect(() => {
        showBackButton();
        showMainButton();

        return () => hideMainButton();
    }, [showBackButton, showMainButton, hideMainButton]);

    const handleUserClick = useCallback(
        (userId: number | undefined) => {
            if (userId !== undefined) {
                if (initData?.user?.id === userId) {
                    navigate(`../../${PROFILE_PAGE}`);
                } else {
                    navigate(
                        `../../${LEADERBOARD_PAGE}/${LEADERBOARD_PROFILE_PAGE}/${userId}`,
                    );
                }
            }
        },
        [navigate, initData?.user?.id],
    );

    const listData: TListData = useMemo(
        () =>
            storeGiftInfo
                ? storeGiftInfo
                      .filter(item => item.paid.date !== null)
                      .map(item => {
                          const isItemSent = item.received?.date !== undefined;

                          return {
                              key: `${item.hash}-${isItemSent}`,
                              icon: (
                                  <RecentActionIcon
                                      avatarUrl={item.paid.tgUser?.avatarUrl}
                                      type={isItemSent ? 'sent' : 'paid'}
                                  />
                              ),
                              title: (
                                  <span className={s.actionTitle}>
                                      {isItemSent
                                          ? t('sendGift')
                                          : t('buyGift')}
                                  </span>
                              ),
                              description: (
                                  <div className={s.actionDescription}>
                                      <button
                                          type="button"
                                          onClick={() =>
                                              handleUserClick(
                                                  item.paid.tgUser?.id,
                                              )
                                          }
                                      >
                                          {item.paid.tgUser?.firstName}
                                      </button>
                                      &nbsp;
                                      {isItemSent
                                          ? t('sentGiftTo')
                                          : t('boughtAGift')}
                                      {isItemSent && (
                                          <>
                                              &nbsp;
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      handleUserClick(
                                                          item.received?.tgUser
                                                              ?.id,
                                                      )
                                                  }
                                              >
                                                  {
                                                      item.received?.tgUser
                                                          ?.firstName
                                                  }
                                              </button>
                                          </>
                                      )}
                                  </div>
                              ),
                          };
                      })
                : [],
        [storeGiftInfo, t, handleUserClick],
    );

    if (!gift) return null;

    return (
        <div className={s.container}>
            <Gift
                data={gift}
                size={GIFT_SIZE_LG}
                options={{
                    withHeader: false,
                    lottieClassName: s.lottie,
                    className: s.gift,
                    withPattern: true,
                }}
            />
            <div className={s.description}>
                <div className={s.name}>
                    <span className={cn(['title1', s.title])}>
                        {t(`gifts.${gift.name}`)}
                    </span>
                    <GiftsAmount
                        amount={gift.amount}
                        available={gift.amountSold}
                        withBackground
                    />
                </div>
                <span className={cn(['text', s.text])}>
                    {t('pages.gift.purchase.description')}
                </span>
                <Currency
                    currency={gift.currency}
                    price={gift.price}
                    inverted
                />
            </div>
            <Separator />
            <div className={s.recentlyActions}>
                <span className="caption">
                    {t('recentlyActions').toUpperCase()}
                </span>
                <List data={listData} />
            </div>
        </div>
    );
};

export default memo(BuyGiftInfoPage);
