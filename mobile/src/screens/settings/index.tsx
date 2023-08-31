import styles from './settings.styles';
import Config from './components/Config';
import {useApp} from 'context/AppContext';
import {Container} from 'components/ui/custom';
import {BdText, Text} from 'components/ui/typography';
import {TouchableOpacity, View} from 'components/ui/themed';

const settings = [
  {
    key: 'theme',
    title: 'Theme',
    options: ['dark', 'light', 'system'],
    description: 'Choose a theme configuration',
  },
  {
    key: 'currency',
    options: ['Native', 'Fiat'],
    title: 'Preferred Currency',
    description: 'Choose between the native chain currency or a fiat currency.',
  },
  {
    key: 'privacy',
    options: ['on', 'off'],
    title: 'Privacy Mode',
    description: 'Toggle balance visibility for your account.',
  },
  {
    key: 'language',
    title: 'Language',
    options: ['English'],
    description: 'Choose a language to use in the app. ',
  },
];

const Settings = () => {
  const {disconnect} = useApp();

  return (
    <Container paddingTop={26} style={[styles.container]}>
      <View style={[styles.header]}>
        <View style={[styles.headerTitle]}>
          <Text style={[styles.headerTitleText]}>Settings</Text>
        </View>
      </View>

      <View style={[styles.settings]}>
        {settings?.map(config => {
          return <Config key={config?.key} config={config} />;
        })}
      </View>

      <TouchableOpacity
        lightColor="#000"
        darkColor="#fff"
        style={[styles.button]}
        onPress={disconnect}>
        <BdText lightColor="#fff" darkColor="#000" style={[styles.button_text]}>
          Diconnect Wallet
        </BdText>
      </TouchableOpacity>
    </Container>
  );
};

export default Settings;
