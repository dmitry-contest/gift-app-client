import { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import EmptyRecentActions from 'src/components/pages/RecentActions/EmptyRecentActions';
import { useBackButton } from 'src/hooks/useBackButton';
import { PROFILE_PAGE } from 'src/constants/menu';
import { useNavigate } from 'react-router-dom';
import { CommonContext } from 'src/context/CommonProvider';
import { DataContext } from 'src/context/DataProvider';
import { formatGenitiveDayMonth } from 'src/utils/getDateTime';
import { useTranslation } from 'react-i18next';
import List, { TListData } from 'src/components/ui/List';
import { TApiTgUser, UserLanguage } from 'src/types/api';
import RightAddon from 'src/components/pages/RecentActions/RightAddon';
import RecentActionIcon from 'src/components/pages/RecentActions/RecentActionIcon';
import { prepareRecentActions } from 'src/utils/prepareRecentActions';

import s from './RecentActions.module.scss';

export interface IRecentAction {
    readonly date: string;
    readonly time: string;
    readonly giftName: string;
    readonly initialDate: Date;
}

export interface IPaidRecentAction extends IRecentAction {
    type: 'paid';
    price: number;
    currency: string;
}

export interface ISentRecentAction extends IRecentAction {
    type: 'sent';
    user: TApiTgUser;
}

export interface IReceivedRecentAction extends IRecentAction {
    type: 'received';
    user: TApiTgUser;
}

export type TRecentAction =
    | IPaidRecentAction
    | ISentRecentAction
    | IReceivedRecentAction;

export type TRecentActions = Array<TRecentAction>;

const RecentActions = () => {
    const {
        data: { user, store },
    } = useContext(DataContext);

    const { t, i18n } = useTranslation();

    const recentActions = useMemo(
        () => prepareRecentActions(user, store),
        [user, store],
    );

    const navigate = useNavigate();
    const { hideMenu, showMenu } = useContext(CommonContext);

    const onBack = useCallback(() => {
        navigate(`/${PROFILE_PAGE}`);
    }, [navigate]);

    const { showBackButton, hideBackButton } = useBackButton(onBack);

    useEffect(() => {
        if (Object.keys(recentActions).length > 0) {
            hideMenu();
        }
    }, [recentActions, hideMenu]);

    useEffect(() => {
        showBackButton();

        return () => {
            showMenu();
            hideBackButton();
        };
    }, [showBackButton, hideBackButton, hideMenu, showMenu]);

    const getListRecentActionData = useCallback(
        (recentActionList: TRecentActions) => {
            return [...recentActionList]
                .sort((a, b) => (a.time > b.time ? -1 : 1))
                .map(recentAction => {
                    return {
                        key: `${recentAction.type}-${recentAction.initialDate}-${recentAction.giftName}`,
                        icon: (
                            <RecentActionIcon
                                type={recentAction.type}
                                giftName={recentAction.giftName}
                            />
                        ),
                        title: (
                            <span className={s.listTitle}>
                                {t(`pages.recentActions.${recentAction.type}`)}
                            </span>
                        ),
                        description: (
                            <span className={s.listDescription}>
                                {t(`gifts.${recentAction.giftName}`)}
                            </span>
                        ),
                        rightAddon: <RightAddon recentAction={recentAction} />,
                    };
                }) as TListData;
        },
        [t],
    );

    return Object.keys(recentActions).length > 0 ? (
        <div className={s.container}>
            <div className={s.header}>
                <span className="title1">{t('recentActions')}</span>
                <span className="text">{t('pages.recentActions.hint')}</span>
            </div>
            {[...Object.entries(recentActions)]
                .sort(([aKey], [bKey]) => (aKey > bKey ? -1 : 1))
                .map(([date, recentAction]) => {
                    return (
                        <div className={s.action} key={date}>
                            <span className={s.date}>
                                {formatGenitiveDayMonth(
                                    date,
                                    i18n.language as UserLanguage,
                                )}
                            </span>
                            <List
                                data={getListRecentActionData(recentAction)}
                            />
                        </div>
                    );
                })}
        </div>
    ) : (
        <EmptyRecentActions />
    );
};

export default memo(RecentActions);
