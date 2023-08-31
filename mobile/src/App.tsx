import Splash from 'screens/splash';
import Navigation from './navigation';
import {useApp} from 'context/AppContext';
import useColorScheme from './hooks/useColorScheme';

const App = () => {
  const {address, user} = useApp();
  const colorScheme = useColorScheme();

  return address && user?.email ? (
    <Navigation colorScheme={colorScheme} />
  ) : (
    <Splash />
  );
};

export default App;
