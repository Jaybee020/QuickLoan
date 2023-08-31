import Cards from './cards';
import {useState} from 'react';
import styles from './splash.styles';
import Colors from 'constants/Colors';
import {useApp} from 'context/AppContext';
import {ArrowRight} from 'lucide-react-native';
import {Container} from 'components/ui/custom';
import AppLogo from 'components/common/AppLogo';
import useColorScheme from 'hooks/useColorScheme';
import * as EmailValidator from 'email-validator';
import {Input, Text} from 'components/ui/typography';
import {TouchableOpacity, View} from 'components/ui/themed';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const Splash = () => {
  const theme = useColorScheme();
  const insets = useSafeAreaInsets();

  const grey = Colors[theme].grey;
  const invert = Colors[theme].invert;
  const background = Colors[theme].background;
  const neutral700 = Colors[theme].neutral700;
  const neutral800 = Colors[theme].neutral800;

  const {createUser} = useApp();

  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  return (
    <KeyboardAwareScrollView style={{backgroundColor: background}}>
      <Container paddingTop={30} style={[styles.container]}>
        <View style={[styles.header]}>
          <AppLogo size={146} />
        </View>

        <View style={[styles.body]}>
          <Cards />
        </View>

        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 20,
            },
          ]}>
          <View
            style={[
              styles.email,
              {
                borderColor: neutral700,
              },
            ]}>
            <Input
              value={email}
              color={invert}
              onChangeText={setEmail}
              placeholderTextColor={grey}
              style={[styles.email__input]}
              placeholder={'abstraction@gmail.com'}
            />

            <TouchableOpacity
              style={[
                styles.footer_button,
                {
                  backgroundColor: neutral800,
                },
              ]}
              onPress={() => {
                if (EmailValidator.validate(email)) {
                  setError(false);
                  createUser(email);
                } else {
                  setError(true);
                }
              }}>
              <ArrowRight color="#fff" />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.footerText,
              {
                color: error ? '#f00' : grey,
              },
            ]}>
            {error
              ? 'Please input a valid email!'
              : 'Provide your email to get started'}
          </Text>
        </View>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Splash;
