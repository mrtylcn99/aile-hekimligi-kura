import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// React Native Toast Message global config
import Toast from 'react-native-toast-message';

// Ana uygulama component'ini React Native toast ile wrap et
const AppWithToast = () => {
  return (
    <>
      <App />
      <Toast />
    </>
  );
};

AppRegistry.registerComponent(appName, () => AppWithToast);