"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

interface CustomThemeProviderProps extends ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
