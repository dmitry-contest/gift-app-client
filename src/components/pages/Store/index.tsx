import { memo, useCallback, useContext, useEffect } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GIFT_SIZE_MD } from 'src/constants/gifts';
import GiftsList from 'src/components/ui/GiftsList';
import GiftIcon from 'src/icons/gift.svg?react';
import { useApi } from 'src/hooks/useApi';
import { DataContext, TStoreItem } from 'src/context/DataProvider';
import { BUY_PAGE, STORE_PAGE } from 'src/constants/menu';
import Currency from 'src/components/ui/Currency';
import cn from 'classnames';
import { CommonContext } from 'src/context/CommonProvider';
import Loader from 'src/components/ui/Loader';

import s from './Store.module.scss';

const Store = () => {
    const isMainRoute = useMatch(STORE_PAGE);
    const { t } = useTranslation();
    const { getStore } = useApi();
    const {
        data: { store },
    } = useContext(DataContext);
    const navigate = useNavigate();
    const { loadersState } = useContext(CommonContext);

    const handleOpenGift = useCallback(
        (gift: TStoreItem) => {
            navigate(`${BUY_PAGE}/${gift.id}`);
        },
        [navigate],
    );

    useEffect(() => {
        getStore();
    }, [getStore]);

    const getData = useCallback(
        (gift: TStoreItem) => {
            const disabled = gift.amount === gift.amountSold;
            return {
                key: String(gift.id),
                giftOptions: {
                    action: {
                        name: disabled ? (
                            t('soldOut')
                        ) : (
                            <Currency
                                currency={gift.currency}
                                price={gift.price}
                            />
                        ),
                        disabled,
                    },
                },
            };
        },
        [t],
    );

    if (loadersState.me && loadersState.store) {
        return <Loader />;
    }

    return (
        <>
            {isMainRoute && (
                <div className={s.container}>
                    <GiftIcon className={s.giftIcon} />
                    <h1 className={cn(['title1', s.title])}>
                        {t('pages.store.title')}
                    </h1>
                    <h2 className={cn(['text', s.description])}>
                        {t('pages.store.description')}
                    </h2>
                    <GiftsList<TStoreItem>
                        getData={getData}
                        onClick={handleOpenGift}
                        size={GIFT_SIZE_MD}
                        data={store}
                        options={{
                            withPattern: true,
                            withGiftName: true,
                            className: s.gift,
                        }}
                    />
                </div>
            )}
            <Outlet />
        </>
    );
};

export default memo(Store);
