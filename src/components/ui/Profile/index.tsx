import {
    FC,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';
import { ThemeContext } from 'src/context/ThemeProvider';
import { EN, RU } from 'src/constants/languages';
import { useTranslation } from 'react-i18next';
import EmptyPlate from 'src/components/ui/EmptyPlate';
import {
    LEADERBOARD_PAGE,
    LEADERBOARD_PROFILE_PAGE,
    PROFILE_PAGE,
} from 'src/constants/menu';

import LightThemeIcon from 'src/icons/themes/light.svg?react';
import DarkThemeIcon from 'src/icons/themes/dark.svg?react';
import Switch from 'src/components/ui/Switch';
import { DARK_THEME, LIGHT_THEME } from 'src/constants/themes';
import UserInfo from 'src/components/ui/UserInfo';
import GiftsList from 'src/components/ui/GiftsList';
import { GIFT_SIZE_SM } from 'src/constants/gifts';
import { useApi } from 'src/hooks/useApi';
import { DataContext, TUserData } from 'src/context/DataProvider';
import { LANGUAGE_KEY } from 'src/constants/localStorage';
import { getStoreGiftById } from 'src/utils/getStoreGiftById';
import Modal from 'src/components/ui/Modal';
import GiftInfo from 'src/components/ui/GiftInfo';
import { TProfileGift, TProfileGifts, UserLanguage } from 'src/types/api';
import { useMainButton } from 'src/hooks/useMainButton';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import cn from 'classnames';
import { CommonContext } from 'src/context/CommonProvider';
import Loader from 'src/components/ui/Loader';

import s from './Profile.module.scss';

const settingsOptions = [
    {
        value: LIGHT_THEME,
        element: LightThemeIcon,
    },
    {
        value: DARK_THEME,
        element: DarkThemeIcon,
    },
];

const languageOptions = [
    {
        value: EN,
        element: () => <span>EN</span>,
    },
    {
        value: RU,
        element: () => <span>RU</span>,
    },
];

const getData = (gift: TProfileGift) => ({
    key: `${gift.id}-${gift.storeOrderNum}`,
});

interface IProfileProps {
    readonly user: TUserData | undefined;
    readonly profile?: boolean;
    readonly loading: boolean;
}

const Profile: FC<IProfileProps> = props => {
    const { user, profile = false, loading } = props;

    const { initData } = useLaunchParams();
    const navigate = useNavigate();

    const { theme, onToggle } = useContext(ThemeContext);
    const { loadersState } = useContext(CommonContext);
    const {
        data: { store },
        updateData,
    } = useContext(DataContext);
    const { getStore, setLanguage } = useApi();
    const { t } = useTranslation();
    const isMainRoute = useMatch(PROFILE_PAGE);
    const {
        i18n: { language, changeLanguage },
    } = useTranslation();
    const [gift, setGift] = useState<TProfileGift>();

    const handleCloseModal = useCallback(() => {
        setGift(undefined);
    }, []);

    const { showMainButton, hideMainButton } = useMainButton(
        t('close'),
        handleCloseModal,
    );

    useEffect(() => {
        return () => {
            if (!profile) {
                updateData({ notMe: undefined });
            }
        };
    }, [profile, updateData]);

    useEffect(() => {
        if (gift) {
            showMainButton();
        } else {
            hideMainButton();
        }

        return () => hideMainButton();
    }, [gift, showMainButton, hideMainButton]);

    const handleGiftClick = useCallback((clickedGift: TProfileGift) => {
        setGift(clickedGift);
    }, []);

    const onChangeLanguage = useCallback(
        async (lang: string) => {
            const userLang = lang as unknown as UserLanguage;
            await changeLanguage(userLang);
            await setLanguage(userLang);
            window.localStorage.setItem(LANGUAGE_KEY, userLang);
        },
        [changeLanguage, setLanguage],
    );

    useEffect(() => {
        getStore();
    }, [getStore]);

    const userGifts: TProfileGifts = useMemo(() => {
        return user?.gifts?.received && user.gifts.received.length > 0
            ? user.gifts.received.flatMap(receivedGift => {
                  const storeGift = getStoreGiftById(
                      store,
                      String(receivedGift.giftId),
                  );
                  if (!storeGift) {
                      return [];
                  }

                  return [
                      {
                          ...receivedGift,
                          ...storeGift,
                          amountSold: 1,
                      } as TProfileGift,
                  ];
              })
            : [];
    }, [user, store]);

    const handleUserClick = useCallback(
        (id: number) => {
            if (initData?.user?.id === id) {
                if (profile) {
                    setGift(undefined);
                } else {
                    navigate(`../../${PROFILE_PAGE}`);
                }
            } else if (profile) {
                navigate(
                    `../${LEADERBOARD_PAGE}/${LEADERBOARD_PROFILE_PAGE}/${id}`,
                );
            } else {
                setGift(undefined);
                if (user?.id !== id) {
                    navigate(`../${LEADERBOARD_PROFILE_PAGE}/${id}`);
                }
            }
        },
        [profile, initData, navigate, user?.id],
    );

    if (loadersState.store && loading) {
        return <Loader />;
    }

    return (
        <>
            {((isMainRoute && profile) || (!profile && !isMainRoute)) && (
                <div className={s.container}>
                    <div className={cn([s.info, !profile && s.notMeInfo])}>
                        {profile && (
                            <Switch
                                options={settingsOptions}
                                selectedOption={theme}
                                onChangeOption={onToggle}
                            />
                        )}
                        <UserInfo user={user} omitRecentActions={!profile} />
                        {profile && (
                            <Switch
                                options={languageOptions}
                                selectedOption={language}
                                onChangeOption={onChangeLanguage}
                            />
                        )}
                    </div>
                    {userGifts.length > 0 ? (
                        <GiftsList<TProfileGift>
                            getData={getData}
                            data={userGifts}
                            size={GIFT_SIZE_SM}
                            onClick={handleGiftClick}
                            options={{
                                withHeader: true,
                                withGiftName: true,
                                className: s.gift,
                                nameClassName: s.name,
                            }}
                        />
                    ) : (
                        <EmptyPlate text={t('emptyGifts')} />
                    )}
                </div>
            )}
            {gift && (
                <Modal onClose={handleCloseModal}>
                    <GiftInfo<TProfileGift>
                        gift={gift}
                        type="profile"
                        onUserClick={handleUserClick}
                    />
                </Modal>
            )}
            <Outlet />
        </>
    );
};

export default memo(Profile);
