import { FC, memo, useCallback } from 'react';
import { TRecentAction } from 'src/components/pages/RecentActions/index';
import { useTranslation } from 'react-i18next';
import UserName from 'src/components/ui/UserName';
import { TApiTgUser } from 'src/types/api';
import { useNavigate } from 'react-router-dom';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { LEADERBOARD_PAGE, LEADERBOARD_PROFILE_PAGE } from 'src/constants/menu';

import s from './RecentActions.module.scss';

interface IRightAddonProps {
    readonly recentAction: TRecentAction;
}

const RightAddon: FC<IRightAddonProps> = props => {
    const { recentAction } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { initData } = useLaunchParams();

    const handleNavigate = useCallback(
        (user: TApiTgUser) => {
            const isMe = initData?.user?.id === +user.id;
            navigate(
                isMe
                    ? '..'
                    : `../../${LEADERBOARD_PAGE}/${LEADERBOARD_PROFILE_PAGE}/${user.id}`,
            );
        },
        [initData?.user?.id, navigate],
    );

    if (recentAction.type === 'paid') {
        return (
            <span className={s.addonPaid}>
                -{recentAction.price} {recentAction.currency}
            </span>
        );
    }

    return (
        <div className={s.addonSentReceived}>
            <span className={s.addonPaid}>
                {t(
                    `pages.recentActions.${recentAction.type === 'sent' ? 'to' : 'from'}`,
                )}
            </span>
            &nbsp;
            <button
                type="button"
                onClick={() => handleNavigate(recentAction.user)}
                className={s.userNameBtn}
            >
                <UserName
                    textClassName={s.userNameText}
                    firstName={recentAction.user.firstName}
                    lastName={recentAction.user.lastName}
                />
            </button>
        </div>
    );
};

export default memo(RightAddon);
