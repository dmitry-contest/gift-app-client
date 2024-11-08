import { initSDK, sdk } from '@tg-gift-app/api-sdk';
import { useCallback, useContext } from 'react';
import { initDataRaw, openTelegramLink } from '@telegram-apps/sdk-react';
import { DataContext } from 'src/context/DataProvider';
import { UserLanguage } from 'src/types/api';
import { CommonContext, ILoadersState } from 'src/context/CommonProvider';

const { api } = initSDK(import.meta.env.PUBLIC_API_URL);

const withErrorHandling = async <
    T extends keyof sdk['api'],
    R extends Omit<Parameters<sdk['api'][T]>[0], 'headers'>,
>(
    method: {
        name: T;
        args?: R;
    },
    onCloseLoading?: () => void,
    onError?: (error: string | undefined) => void,
): Promise<selectResponse<sdk['api'][T], 200> | undefined> => {
    onError?.(undefined);
    try {
        // @ts-ignore
        const { status, body } = await api[method.name]({
            headers: { 'x-init-data': initDataRaw() ?? '' },
            ...(method.args ? { ...method.args } : {}),
        });

        if (status === 200) {
            return body;
        }
        // @ts-ignore
        if ((status === 404 || status === 400) && body && 'message' in body) {
            // @ts-ignore
            onError?.(body.message);
        }
    } catch (error) {
        console.error(error);
    } finally {
        onCloseLoading?.();
    }

    return undefined;
};

export const useApi = () => {
    const { updateData } = useContext(DataContext);
    const { setLoaders, setError } = useContext(CommonContext);

    const closeLoader = useCallback(
        (loaderName: keyof ILoadersState) => {
            setLoaders({ [loaderName]: false });
        },
        [setLoaders],
    );

    const getMe = useCallback(async () => {
        setLoaders({ me: true });
        const response = await withErrorHandling(
            { name: 'me' },
            () => closeLoader('me'),
            setError,
        );

        if (response) {
            updateData({ user: response.user });
        }
    }, [updateData, setLoaders, closeLoader, setError]);

    const getStore = useCallback(async () => {
        setLoaders({ store: true });
        const response = await withErrorHandling(
            { name: 'store' },
            () => closeLoader('store'),
            setError,
        );

        if (response) {
            updateData({ store: response.store });
        }
    }, [updateData, setLoaders, closeLoader, setError]);

    const getLeaderboard = useCallback(async () => {
        setLoaders({ leaderboard: true });
        const response = await withErrorHandling(
            { name: 'leaderboard' },
            () => closeLoader('leaderboard'),
            setError,
        );

        if (response) {
            updateData({ leaderboard: response.leaderboard });
        }
    }, [updateData, setLoaders, closeLoader, setError]);

    const notMe = useCallback(
        async (tgUserId: string) => {
            setLoaders({ notMe: true });
            const response = await withErrorHandling(
                { name: 'notMe', args: { query: { tgUserId } } },
                () => closeLoader('notMe'),
                setError,
            );

            if (response) {
                updateData({ notMe: response.user });
            }
        },
        [updateData, setLoaders, closeLoader, setError],
    );

    const buyGift = useCallback(
        async (id: number) => {
            setLoaders({ buy: true });
            const response = await withErrorHandling(
                { name: 'giftBuy', args: { body: { gift: { id } } } },
                () => closeLoader('buy'),
                setError,
            );

            if (response?.invoice) {
                openTelegramLink(`${response.invoice.url}`);
            }
        },
        [setLoaders, closeLoader, setError],
    );

    const receiveGift = useCallback(
        async (purchaseHash: string) => {
            setLoaders({ receive: true });
            const receivedGift = await withErrorHandling(
                { name: 'giftReceived', args: { body: { purchaseHash } } },
                () => closeLoader('receive'),
                setError,
            );

            if (receivedGift) {
                updateData({ receivedGift });
                await getMe();
            }
        },
        [closeLoader, getMe, setLoaders, updateData, setError],
    );

    const setLanguage = useCallback(
        async (language: UserLanguage) => {
            const response = await withErrorHandling(
                {
                    name: 'setLanguage',
                    args: { body: { language } },
                },
                undefined,
                setError,
            );

            if (response) {
                await getMe();
            }
        },
        [getMe, setError],
    );

    const getStoreGiftInfo = useCallback(
        async (id: string) => {
            setLoaders({ giftInfo: true });
            const response = await withErrorHandling(
                { name: 'storeGiftInfo', args: { query: { id } } },
                () => closeLoader('giftInfo'),
                setError,
            );

            if (response) {
                updateData({ storeGiftInfo: response });
            }
        },
        [closeLoader, setLoaders, updateData, setError],
    );

    return {
        getStore,
        getMe,
        buyGift,
        receiveGift,
        getLeaderboard,
        setLanguage,
        notMe,
        getStoreGiftInfo,
    };
};
