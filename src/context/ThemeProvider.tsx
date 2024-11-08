import {
    memo,
    PropsWithChildren,
    FC,
    createContext,
    useState,
    useMemo,
    useCallback,
    useEffect,
    Suspense,
} from 'react';
import {
    DARK_THEME,
    HEADER_BACKGROUND_DARK_COLOR,
    HEADER_BACKGROUND_LIGHT_COLOR,
    LIGHT_THEME,
    MINIBAR_BACKGROUND_DARK_COLOR,
    MINIBAR_BACKGROUND_LIGHT_COLOR,
} from 'src/constants/themes';
import {
    setMiniAppHeaderColor,
    setMiniAppBottomBarColor,
} from '@telegram-apps/sdk-react';
import { THEME_KEY } from 'src/constants/localStorage.ts';

export type TTheme = typeof LIGHT_THEME | typeof DARK_THEME;

export interface IThemeContextProps {
    readonly theme: TTheme;
    readonly onToggle: () => void;
}

export interface IThemeProviderProps {
    readonly initialTheme: TTheme;
}

export const ThemeContext = createContext<IThemeContextProps>({
    theme: LIGHT_THEME,
    onToggle: () => undefined,
});

const ThemeProvider: FC<PropsWithChildren<IThemeProviderProps>> = props => {
    const { children, initialTheme } = props;

    const [theme, setTheme] = useState<TTheme>(initialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        const isLight = theme === LIGHT_THEME;
        setMiniAppHeaderColor(
            isLight
                ? HEADER_BACKGROUND_LIGHT_COLOR
                : HEADER_BACKGROUND_DARK_COLOR,
        );
        setMiniAppBottomBarColor(
            isLight
                ? MINIBAR_BACKGROUND_LIGHT_COLOR
                : MINIBAR_BACKGROUND_DARK_COLOR,
        );
    }, [theme]);

    const onToggle = useCallback(() => {
        const nextTheme = theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
        setTheme(nextTheme);
        window.localStorage.setItem(THEME_KEY, nextTheme);
    }, [theme]);

    const contextValue = useMemo(
        () => ({ theme, onToggle }),
        [theme, onToggle],
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <Suspense>{children}</Suspense>
        </ThemeContext.Provider>
    );
};

export default memo(ThemeProvider);
