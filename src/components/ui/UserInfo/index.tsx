import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'src/components/ui/Avatar';
import UserName from 'src/components/ui/UserName';
import { useTranslation } from 'react-i18next';
import Timer from 'src/icons/timer.svg?react';
import { PROFILE_RECENT_ACTIONS } from 'src/constants/menu';
import { TUserData } from 'src/context/DataProvider';

import s from './UserInfo.module.scss';

export interface IUserInfoProps {
    readonly omitRecentActions?: boolean;
    readonly user: TUserData | undefined;
}

const UserInfo: FC<IUserInfoProps> = props => {
    const { omitRecentActions, user } = props;

    const { t } = useTranslation();

    if (!user) {
        return null;
    }

    return (
        <div className={s.container}>
            <Avatar
                url={user.tg.avatarUrl}
                firstName={user.tg.firstName}
                lastName={user.tg.lastName}
                rate={user.leaderboard.position}
                className={s.avatar}
            />
            <UserName
                firstName={user.tg.firstName}
                lastName={user.tg.lastName}
                showPremiumIcon={user.tg.premium}
            />
            <span className={s.giftsHint}>
                {t('giftsReceived', { count: user.gifts.received.length })}
            </span>
            {!omitRecentActions && (
                <Link
                    to={PROFILE_RECENT_ACTIONS}
                    type="button"
                    className={s.recentActions}
                >
                    <Timer />
                    <span>{`${t('recentActions')} ›`}</span>
                </Link>
            )}
        </div>
    );
};

export default memo(UserInfo);
