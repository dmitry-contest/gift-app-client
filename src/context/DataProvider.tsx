import {
    FC,
    PropsWithChildren,
    createContext,
    useMemo,
    memo,
    useState,
    useCallback,
} from 'react';
import type { sdk } from '@tg-gift-app/api-sdk';
import { TReceivedGift, TStoreGiftInfo } from 'src/types/api';

export type TStoreData = selectResponse<sdk['api']['store'], 200>['store'];

export type TStoreItem = TStoreData extends (infer StoreItem)[]
    ? StoreItem
    : unknown;

export type TLeaderboard = selectResponse<
    sdk['api']['leaderboard'],
    200
>['leaderboard'];

export type TUserData = selectResponse<sdk['api']['me'], 200>['user'];

interface IDataProviderData {
    readonly store: TStoreData;
    readonly user: TUserData | undefined;
    readonly leaderboard: TLeaderboard;
    readonly notMe: TUserData | undefined;
    readonly receivedGift: TReceivedGift | undefined;
    readonly storeGiftInfo: TStoreGiftInfo | undefined;
}

export interface IDataContextProps {
    readonly data: IDataProviderData;
    readonly updateData: (data: Partial<IDataProviderData>) => void;
}

const DEFAULT_DATA = {
    store: [],
    user: undefined,
    leaderboard: [],
    notMe: undefined,
    receivedGift: undefined,
    storeGiftInfo: undefined,
};

export const DataContext = createContext<IDataContextProps>({
    updateData: () => undefined,
    data: DEFAULT_DATA,
});

const DataProvider: FC<PropsWithChildren> = props => {
    const [data, setData] = useState<IDataProviderData>(DEFAULT_DATA);

    const { children } = props;

    const updateData = useCallback((newData: Partial<IDataProviderData>) => {
        setData(prevData => ({
            ...prevData,
            ...newData,
        }));
    }, []);

    const value = useMemo(
        () => ({
            updateData,
            data,
        }),
        [updateData, data],
    );

    return (
        <DataContext.Provider value={value}>{children}</DataContext.Provider>
    );
};

export default memo(DataProvider);
