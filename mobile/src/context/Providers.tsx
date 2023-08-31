import 'react-native-gesture-handler';
import App from '../App';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import AppContextProvider from './AppContext';
import SettingsProvider from './SettingsContext';
import {MenuProvider} from 'react-native-popup-menu';
import {SafeAreaProvider} from 'react-native-safe-area-context';

dayjs.extend(duration);

export const Providers = () => {
  return (
    <SettingsProvider>
      <AppContextProvider>
        <SafeAreaProvider>
          <MenuProvider>
            <App />
          </MenuProvider>
        </SafeAreaProvider>
      </AppContextProvider>
    </SettingsProvider>
  );
};
