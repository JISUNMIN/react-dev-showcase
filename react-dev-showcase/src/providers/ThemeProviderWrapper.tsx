import { ReactNode, createContext, useContext } from 'react';

import { ThemeProvider } from 'styled-components';

import { useTheme } from '@hooks/index';
import GlobalStyles from '@styles/GlobalStyles.ts';
import themes from '@styles/themes';

interface ThemeContextType {
  theme: 'light' | 'dark';
  onChangeTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext ThemeProviderWrapper 안에서 사용돼야 합니다.');
  }
  return context;
};

const ThemeProviderWrapper = ({ children }: ThemeProviderProps) => {
  const { theme, onChangeTheme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, onChangeTheme }}>
      <ThemeProvider theme={{ ...currentTheme }}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
