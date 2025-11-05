import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'react-native';

export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    shadow: string;
    overlay: string;
  };
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#ff6b35',
    primaryDark: '#cc5528',
    primaryLight: '#ff8c42',
    secondary: '#ffa560',
    background: '#ffffff',
    surface: '#f8f9fa',
    card: '#ffffff',
    text: '#2d2d2d',
    textSecondary: '#666666',
    border: '#e5e7eb',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    shadow: 'rgba(255, 107, 53, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#ff6b35',
    primaryDark: '#ff8c42',
    primaryLight: '#cc5528',
    secondary: '#ffa560',
    background: '#121212',
    surface: '#1e1e1e',
    card: '#2a2a2a',
    text: '#f5f5f5',
    textSecondary: '#b0b0b0',
    border: '#3a3a3a',
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
  systemTheme: boolean;
  setSystemTheme: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [systemTheme, setSystemTheme] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (systemTheme && deviceColorScheme) {
      setIsDarkMode(deviceColorScheme === 'dark');
    }
  }, [deviceColorScheme, systemTheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@AileHekimligi:theme');
      const savedSystemTheme = await AsyncStorage.getItem('@AileHekimligi:systemTheme');

      if (savedSystemTheme !== null) {
        setSystemTheme(savedSystemTheme === 'true');
      }

      if (savedTheme !== null && savedSystemTheme === 'false') {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      setSystemTheme(false);
      await AsyncStorage.setItem('@AileHekimligi:theme', newTheme ? 'dark' : 'light');
      await AsyncStorage.setItem('@AileHekimligi:systemTheme', 'false');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const handleSetSystemTheme = async (value: boolean) => {
    try {
      setSystemTheme(value);
      await AsyncStorage.setItem('@AileHekimligi:systemTheme', value.toString());
      if (value && deviceColorScheme) {
        setIsDarkMode(deviceColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to save system theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDarkMode,
        systemTheme,
        setSystemTheme: handleSetSystemTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};