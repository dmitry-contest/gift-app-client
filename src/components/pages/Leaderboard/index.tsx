import {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';
import Search from 'src/components/ui/Search';
import { useApi } from 'src/hooks/useApi';
import List, { IListItem, TListData } from 'src/components/ui/List';
import { DataContext } from 'src/context/DataProvider';
import GiftIcon from 'src/icons/gift.svg?react';
import Avatar from 'src/components/ui/Avatar';
import UserName from 'src/components/ui/UserName';
import { useTranslation } from 'react-i18next';
import LeaderboardPosition from 'src/components/ui/LeaderboardPosition';
import ListItem from 'src/components/ui/List/ListItem';
import { useNavigate, Outlet, useMatch } from 'react-router-dom';
import {
    LEADERBOARD_PROFILE_PAGE,
    LEADERBOARD_PAGE,
    PROFILE_PAGE,
} from 'src/constants/menu';
import { CommonContext } from 'src/context/CommonProvider';
import Loader from 'src/components/ui/Loader';

import s from './Leaderboard.module.scss';

const Leaderboard = () => {
    const { getLeaderboard } = useApi();
    const [isPinned, setIsPinned] = useState(false);
    const pinRef = useRef(null);
    const {
        data: { leaderboard, user: meUser },
    } = useContext(DataContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMainRoute = useMatch(LEADERBOARD_PAGE);
    const { loadersState } = useContext(CommonContext);

    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        getLeaderboard();
    }, [getLeaderboard]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsPinned(!entry.isIntersecting);
            },
            { threshold: 1.0 },
        );

        if (pinRef.current) {
            if (isMainRoute) {
                observer.observe(pinRef.current);
            }
        }

        return () => {
            if (pinRef.current) {
                observer.unobserve(pinRef.current);
            }
        };
    }, [isMainRoute]);

    const data: TListData = useMemo(() => {
        return leaderboard
            .filter(
                item =>
                    item.tgUser.firstName?.includes(searchValue) ||
                    item.tgUser.lastName?.includes(searchValue),
            )
            .map((user, idx) => ({
                key: String(user.tgUser.id),
                ...(meUser?.id === user.tgUser.id ? { pinRef } : {}),
                icon: (
                    <Avatar
                        className={s.avatar}
                        firstName={user.tgUser.firstName}
                        lastName={user.tgUser.lastName}
                        size={40}
                        url={user.tgUser.avatarUrl}
                    />
                ),
                title: (
                    <UserName
                        firstName={user.tgUser.firstName}
                        lastName={user.tgUser.lastName}
                        showPremiumIcon={false}
                        textClassName={cn(['textBold', s.title])}
                        {...(meUser?.id === user.tgUser.id
                            ? {
                                  customSign: (
                                      <span className={s.customSign}>
                                          {t('you')}
                                      </span>
                                  ),
                              }
                            : {})}
                    />
                ),
                description: (
                    <div className={s.description}>
                        <GiftIcon
                            width={12}
                            height={12}
                            className={s.giftIcon}
                        />
                        <span className={s.descriptionText}>
                            {t('giftsCount', {
                                count: user.amount,
                                value: user.amount.toLocaleString(),
                            })}
                        </span>
                    </div>
                ),
                rightAddon: <LeaderboardPosition position={idx + 1} />,
            }));
    }, [leaderboard, meUser?.id, searchValue, t]);

    const pinnedItem = useMemo(
        () =>
            data.find(
                dataItem => meUser?.id && String(meUser.id) === dataItem.key,
            ),
        [data, meUser?.id],
    );

    const handleItemClick = useCallback(
        (item: IListItem) => {
            const isMe = meUser?.id === +item.key;
            navigate(
                isMe
                    ? `../${PROFILE_PAGE}`
                    : `${LEADERBOARD_PROFILE_PAGE}/${item.key}`,
            );
        },
        [navigate, meUser?.id],
    );

    if (loadersState.leaderboard && loadersState.me) {
        return <Loader />;
    }

    return isMainRoute ? (
        <div>
            <Search value={searchValue} onChange={setSearchValue} />
            <List className={s.list} data={data} onClick={handleItemClick} />
            {isPinned && pinnedItem && (
                <ListItem
                    item={pinnedItem}
                    listItemClassName={s.listItem}
                    onClick={handleItemClick}
                />
            )}
        </div>
    ) : (
        <Outlet />
    );
};

export default memo(Leaderboard);
