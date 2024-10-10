import { useCallback, useEffect, useState } from 'react';

type ThemeNameType = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeNameType>(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeNameType;
    return storedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const onChangeTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return {
    theme,
    onChangeTheme,
  };
};

export default useTheme;
