import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type HTMLAttributes,
    type PropsWithChildren,
} from 'react';

export type ReshetThemeMode = 'light' | 'dark' | 'system';
export type ReshetResolvedTheme = 'light' | 'dark';

type DarkModeContextValue = {
    theme: ReshetThemeMode;
    resolvedTheme: ReshetResolvedTheme;
    setTheme: (theme: ReshetThemeMode) => void;
    isDark: boolean;
};

type DarkModeProviderProps = PropsWithChildren & Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
    theme?: ReshetThemeMode;
    defaultTheme?: ReshetThemeMode;
    onThemeChange?: (theme: ReshetThemeMode) => void;
    syncDocumentTheme?: boolean;
};

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

const getSystemTheme = (): ReshetResolvedTheme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const DarkModeProvider = ({
    children,
    theme,
    defaultTheme = 'light',
    onThemeChange,
    syncDocumentTheme = true,
    style,
    ...props
}: DarkModeProviderProps) => {
    const [internalTheme, setInternalTheme] = useState<ReshetThemeMode>(defaultTheme);
    const [systemTheme, setSystemTheme] = useState<ReshetResolvedTheme>(getSystemTheme);
    const selectedTheme = theme ?? internalTheme;
    const resolvedTheme = selectedTheme === 'system' ? systemTheme : selectedTheme;

    useEffect(() => {
        if (selectedTheme !== 'system' || typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
        };

        handleSystemThemeChange();
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [selectedTheme]);

    useEffect(() => {
        if (!syncDocumentTheme || typeof document === 'undefined') {
            return;
        }

        const root = document.documentElement;
        const previousTheme = root.getAttribute('data-theme');
        const previousReshetTheme = root.getAttribute('data-reshet-theme');
        const previousColorScheme = root.style.colorScheme;

        root.setAttribute('data-theme', resolvedTheme);
        root.setAttribute('data-reshet-theme', selectedTheme);
        root.style.colorScheme = resolvedTheme;

        return () => {
            if (previousTheme) {
                root.setAttribute('data-theme', previousTheme);
            } else {
                root.removeAttribute('data-theme');
            }

            if (previousReshetTheme) {
                root.setAttribute('data-reshet-theme', previousReshetTheme);
            } else {
                root.removeAttribute('data-reshet-theme');
            }

            root.style.colorScheme = previousColorScheme;
        };
    }, [resolvedTheme, selectedTheme, syncDocumentTheme]);

    const value = useMemo<DarkModeContextValue>(() => ({
        theme: selectedTheme,
        resolvedTheme,
        isDark: resolvedTheme === 'dark',
        setTheme: (nextTheme) => {
            if (theme === undefined) {
                setInternalTheme(nextTheme);
            }

            onThemeChange?.(nextTheme);
        },
    }), [onThemeChange, resolvedTheme, selectedTheme, theme]);

    return (
        <DarkModeContext.Provider value={value}>
            <div
                {...props}
                data-theme={resolvedTheme}
                data-reshet-theme={selectedTheme}
                style={{ colorScheme: resolvedTheme, ...style }}>
                {children}
            </div>
        </DarkModeContext.Provider>
    );
};

export const ThemeProvider = DarkModeProvider;

export const useReshetTheme = () => {
    const context = useContext(DarkModeContext);

    if (!context) {
        throw new Error('useReshetTheme must be used inside DarkModeProvider.');
    }

    return context;
};
