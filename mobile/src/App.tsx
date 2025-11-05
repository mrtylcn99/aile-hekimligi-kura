import React from 'react';
import {StatusBar, LogBox, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {AuthProvider} from './contexts/AuthContext';
import {LanguageProvider} from './contexts/LanguageContext';
import {ThemeProvider} from './contexts/ThemeContext';
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import NetworkStatus from './components/NetworkStatus';
import {Colors} from './styles/Colors';

// Geliştirme aşamasında bazı uyarıları gizle
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
  'ViewPropTypes will be removed',
]);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <View style={{flex: 1}}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={Colors.primary}
            translucent={false}
          />
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
                <NetworkStatus />
                <Toast position="top" topOffset={50} />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </View>
    </ErrorBoundary>
  );
};

export default App;