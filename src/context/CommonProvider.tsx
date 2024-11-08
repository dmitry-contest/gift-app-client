import {
    createContext,
    memo,
    FC,
    PropsWithChildren,
    useMemo,
    useState,
    useCallback,
} from 'react';

export interface ILoadersState {
    readonly me: boolean;
    readonly notMe: boolean;
    readonly store: boolean;
    readonly leaderboard: boolean;
    readonly buy: boolean;
    readonly receive: boolean;
    readonly giftInfo: boolean;
}

export interface ICommonProviderProps {
    readonly isMenuVisible: boolean;
    readonly showMenu: () => void;
    readonly hideMenu: () => void;
    readonly loadersState: ILoadersState;
    readonly setLoaders: (loaders: Partial<ILoadersState>) => void;
    readonly error: string | undefined;
    readonly setError: (error: string | undefined) => void;
}

const defaultLoadersState: ILoadersState = {
    me: false,
    notMe: false,
    store: false,
    leaderboard: false,
    buy: false,
    receive: false,
    giftInfo: false,
};

export const CommonContext = createContext<ICommonProviderProps>({
    isMenuVisible: true,
    showMenu: () => undefined,
    hideMenu: () => undefined,
    loadersState: defaultLoadersState,
    setLoaders: () => undefined,
    error: undefined,
    setError: () => undefined,
});

const CommonProvider: FC<PropsWithChildren> = props => {
    const { children } = props;

    const [isMenuVisible, setMenuVisible] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [loadersState, updateLoaders] =
        useState<ILoadersState>(defaultLoadersState);

    const hideMenu = useCallback(() => {
        setMenuVisible(false);
    }, []);

    const showMenu = useCallback(() => {
        setMenuVisible(true);
    }, []);

    const setLoaders = useCallback(
        (updatedLoaders: Partial<ILoadersState>) => {
            updateLoaders(prevLoadersState => ({
                ...prevLoadersState,
                ...updatedLoaders,
            }));
        },
        [updateLoaders],
    );

    const value = useMemo(
        () => ({
            isMenuVisible,
            hideMenu,
            showMenu,
            loadersState,
            setLoaders,
            error,
            setError,
        }),
        [
            isMenuVisible,
            hideMenu,
            showMenu,
            loadersState,
            setLoaders,
            error,
            setError,
        ],
    );

    return (
        <CommonContext.Provider value={value}>
            {children}
        </CommonContext.Provider>
    );
};

export default memo(CommonProvider);
